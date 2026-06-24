-- AI Transformation Command Center — Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Companies
-- =============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),  -- small, medium, large, enterprise
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- AI Projects (Portfolio Manager)
-- =============================================
CREATE TABLE ai_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    impact_score DECIMAL(3,1) DEFAULT 5.0 CHECK (impact_score BETWEEN 0 AND 10),
    feasibility_score DECIMAL(3,1) DEFAULT 5.0 CHECK (feasibility_score BETWEEN 0 AND 10),
    quadrant VARCHAR(50) GENERATED ALWAYS AS (
        CASE
            WHEN impact_score >= 5 AND feasibility_score >= 5 THEN 'Quick Win'
            WHEN impact_score >= 5 AND feasibility_score < 5 THEN 'Big Bet'
            WHEN impact_score < 5 AND feasibility_score >= 5 THEN 'Fill-In'
            ELSE 'Deprioritize'
        END
    ) STORED,
    status VARCHAR(50) DEFAULT 'ideation'
        CHECK (status IN ('ideation','assessment','pilot','scaling','production')),
    estimated_roi DECIMAL(12,2),
    implementation_cost DECIMAL(12,2),
    timeline_months INTEGER,
    risk_level VARCHAR(20) DEFAULT 'medium'
        CHECK (risk_level IN ('low','medium','high')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_company ON ai_projects(company_id);
CREATE INDEX idx_projects_quadrant ON ai_projects(quadrant);

-- =============================================
-- Maturity Assessments
-- =============================================
CREATE TABLE maturity_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    assessment_date TIMESTAMP DEFAULT NOW(),
    overall_score DECIMAL(3,1),
    strategy_score DECIMAL(3,1),
    data_score DECIMAL(3,1),
    technology_score DECIMAL(3,1),
    talent_score DECIMAL(3,1),
    governance_score DECIMAL(3,1),
    culture_score DECIMAL(3,1),
    maturity_level VARCHAR(50)
        CHECK (maturity_level IN ('Initial','Developing','Defined','Managed','Optimizing')),
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_maturity_company ON maturity_assessments(company_id);

-- =============================================
-- Maturity Answers (individual question responses)
-- =============================================
CREATE TABLE maturity_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES maturity_assessments(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    score INTEGER CHECK (score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ROI Simulations
-- =============================================
CREATE TABLE roi_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES ai_projects(id) ON DELETE SET NULL,
    current_revenue DECIMAL(15,2),
    current_cost DECIMAL(15,2),
    revenue_increase_pct DECIMAL(5,2),
    cost_reduction_pct DECIMAL(5,2),
    implementation_cost DECIMAL(15,2),
    timeline_months INTEGER DEFAULT 12,
    discount_rate DECIMAL(5,4) DEFAULT 0.1,
    -- Calculated results
    total_benefit DECIMAL(15,2),
    net_benefit DECIMAL(15,2),
    roi_percentage DECIMAL(8,2),
    payback_months DECIMAL(6,1),
    npv DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Architecture Designs
-- =============================================
CREATE TABLE architecture_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES ai_projects(id) ON DELETE SET NULL,
    project_name VARCHAR(255),
    architecture_type VARCHAR(50) CHECK (architecture_type IN ('batch','real_time','hybrid')),
    include_monitoring BOOLEAN DEFAULT true,
    include_feature_store BOOLEAN DEFAULT false,
    components JSONB,
    svg_diagram TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Roadmaps
-- =============================================
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    duration_months INTEGER DEFAULT 12,
    maturity_level VARCHAR(50),
    phases JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Discovery Results
-- =============================================
CREATE TABLE discovery_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    industry VARCHAR(100),
    business_problems TEXT[],
    opportunities JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Wardley Maps
-- =============================================
CREATE TABLE wardley_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES ai_projects(id) ON DELETE SET NULL,
    name VARCHAR(255),
    components JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- Seed Data — Demo Company
-- =============================================
INSERT INTO companies (id, name, industry, size) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Acme Corp (Demo)', 'Retail', 'large');

INSERT INTO ai_projects (company_id, name, description, impact_score, feasibility_score, status, estimated_roi, implementation_cost, timeline_months) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Customer Churn Prediction', 'ML model to predict customer churn and trigger retention campaigns', 8.5, 7.0, 'pilot', 1200000, 350000, 6),
    ('a0000000-0000-0000-0000-000000000001', 'Demand Forecasting', 'Deep learning model for inventory demand prediction across 500+ SKUs', 9.0, 6.0, 'assessment', 2500000, 800000, 12),
    ('a0000000-0000-0000-0000-000000000001', 'Chatbot for Support', 'NLP-powered chatbot to handle tier-1 customer support tickets', 6.5, 8.5, 'scaling', 800000, 200000, 4),
    ('a0000000-0000-0000-0000-000000000001', 'Price Optimization', 'Dynamic pricing engine using competitor and demand signals', 7.5, 4.5, 'ideation', 3000000, 1200000, 18),
    ('a0000000-0000-0000-0000-000000000001', 'Fraud Detection', 'Real-time transaction fraud scoring with anomaly detection', 8.0, 5.5, 'assessment', 1500000, 500000, 9),
    ('a0000000-0000-0000-0000-000000000001', 'Document Processing', 'OCR + NLP pipeline for automated invoice and contract processing', 5.0, 9.0, 'production', 600000, 150000, 3),
    ('a0000000-0000-0000-0000-000000000001', 'Recommendation Engine', 'Personalized product recommendations using collaborative filtering', 7.0, 7.5, 'pilot', 1800000, 400000, 8),
    ('a0000000-0000-0000-0000-000000000001', 'Sentiment Analysis', 'Social media and review sentiment tracking for brand health', 4.0, 8.0, 'ideation', 300000, 100000, 3);

-- Seed a maturity assessment
INSERT INTO maturity_assessments (company_id, overall_score, strategy_score, data_score, technology_score, talent_score, governance_score, culture_score, maturity_level, recommendations) VALUES
    ('a0000000-0000-0000-0000-000000000001', 3.2, 3.5, 3.0, 3.8, 2.5, 3.0, 3.4, 'Defined',
     '["Establish a formal AI Center of Excellence","Invest in data quality and governance frameworks","Develop internal ML engineering talent pipeline","Create an AI ethics review board","Implement MLOps practices for model lifecycle management"]'::jsonb);
