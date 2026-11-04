CREATE EXTENSION IF NOT EXISTS postgis;

CREATE SCHEMA IF NOT EXISTS citizen;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS report;
CREATE SCHEMA IF NOT EXISTS geo;
CREATE SCHEMA IF NOT EXISTS evidence;
CREATE SCHEMA IF NOT EXISTS case_mgmt;
CREATE SCHEMA IF NOT EXISTS project;
CREATE SCHEMA IF NOT EXISTS conversation;
CREATE SCHEMA IF NOT EXISTS participation;

CREATE TABLE citizen.citizen (
    citizen_id UUID PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(200) UNIQUE,
    phone VARCHAR(30),
    document_hash VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE citizen.citizen_consent (
    consent_id UUID PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES citizen.citizen (citizen_id),
    consent_type VARCHAR(100) NOT NULL,
    accepted BOOLEAN NOT NULL,
    policy_version VARCHAR(50) NOT NULL,
    accepted_at TIMESTAMP NOT NULL DEFAULT NOW(),
    source VARCHAR(50) NOT NULL
);

CREATE TABLE catalog.category (
    category_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE catalog.neighborhood (
    neighborhood_id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    commune VARCHAR(100),
    locality VARCHAR(100),
    population INTEGER,
    geom GEOGRAPHY(MULTIPOLYGON, 4326),
    UNIQUE (name, commune)
);

CREATE TABLE report.report (
    report_id UUID PRIMARY KEY,
    case_number VARCHAR(40) UNIQUE NOT NULL,
    citizen_id UUID REFERENCES citizen.citizen (citizen_id),
    category_id UUID NOT NULL REFERENCES catalog.category (category_id),
    title VARCHAR(250),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'RECIBIDO',
    priority VARCHAR(30) NOT NULL DEFAULT 'MEDIUM',
    source VARCHAR(50) NOT NULL,
    ai_classification JSONB,
    public_visibility BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE geo.report_location (
    location_id UUID PRIMARY KEY,
    report_id UUID NOT NULL UNIQUE REFERENCES report.report (report_id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    geom GEOGRAPHY(POINT, 4326) NOT NULL,
    address VARCHAR(300),
    neighborhood_id UUID REFERENCES catalog.neighborhood (neighborhood_id),
    locality VARCHAR(150),
    reference TEXT
);

CREATE INDEX report_location_geom_idx ON geo.report_location USING GIST (geom);
CREATE INDEX neighborhood_geom_idx ON catalog.neighborhood USING GIST (geom);

CREATE TABLE evidence.evidence (
    evidence_id UUID PRIMARY KEY,
    report_id UUID NOT NULL REFERENCES report.report (report_id),
    evidence_type VARCHAR(30) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE case_mgmt.case_management (
    case_id UUID PRIMARY KEY,
    report_id UUID NOT NULL UNIQUE REFERENCES report.report (report_id),
    current_status VARCHAR(50) NOT NULL DEFAULT 'RECIBIDO',
    responsible_entity VARCHAR(200),
    responsible_area VARCHAR(200),
    assigned_at TIMESTAMP,
    target_resolution_date TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE case_mgmt.case_history (
    history_id UUID PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES case_mgmt.case_management (case_id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    description TEXT,
    changed_by VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE project.project (
    project_id UUID PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    neighborhood_id UUID REFERENCES catalog.neighborhood (neighborhood_id),
    progress DECIMAL(5, 2) NOT NULL DEFAULT 0,
    start_date DATE,
    estimated_end_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT project_progress_range CHECK (progress >= 0 AND progress <= 100)
);

CREATE TABLE project.project_report (
    project_id UUID NOT NULL REFERENCES project.project (project_id),
    report_id UUID NOT NULL REFERENCES report.report (report_id),
    PRIMARY KEY (project_id, report_id)
);

CREATE TABLE conversation.conversation (
    conversation_id UUID PRIMARY KEY,
    citizen_id UUID REFERENCES citizen.citizen (citizen_id),
    channel VARCHAR(30) NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP
);

CREATE TABLE conversation.conversation_message (
    message_id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES conversation.conversation (conversation_id),
    sender_type VARCHAR(30) NOT NULL,
    message TEXT NOT NULL,
    intent VARCHAR(100),
    entities JSONB,
    sentiment VARCHAR(50),
    classification JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE participation.participation (
    participation_id UUID PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES citizen.citizen (citizen_id),
    target_type VARCHAR(30) NOT NULL,
    target_id UUID NOT NULL,
    participation_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (citizen_id, target_type, target_id, participation_type)
);
