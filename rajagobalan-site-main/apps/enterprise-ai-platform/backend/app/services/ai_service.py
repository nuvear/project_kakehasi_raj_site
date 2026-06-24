"""AI service for OpenAI integration with fallback logic."""

import json
from typing import Optional, List, Dict, Any
from app.config import settings


class AIService:
    """Service for AI operations with OpenAI and fallbacks."""

    @staticmethod
    def has_openai() -> bool:
        """Check if OpenAI API key is configured."""
        return settings.OPENAI_API_KEY is not None

    @staticmethod
    def generate_use_cases(
        industry: str,
        problems: List[str]
    ) -> List[Dict[str, Any]]:
        """
        Generate AI use cases based on industry and business problems.
        Uses OpenAI if available, otherwise uses rule-based fallback.
        """
        if AIService.has_openai():
            return AIService._generate_use_cases_openai(industry, problems)
        else:
            return AIService._generate_use_cases_fallback(industry, problems)

    @staticmethod
    def _generate_use_cases_openai(
        industry: str,
        problems: List[str]
    ) -> List[Dict[str, Any]]:
        """Generate use cases using OpenAI API."""
        try:
            import openai

            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

            prompt = f"""You are an AI transformation consultant.

Industry: {industry}
Business Problems: {', '.join(problems)}

Generate 5-8 AI use cases that address these problems. For each use case, provide:
1. use_case: Short name (3-4 words)
2. description: 1-2 sentence explanation
3. prediction_target: What is being predicted/optimized
4. expected_roi: Estimated ROI percentage (e.g., 25.5)
5. complexity: 'low', 'medium', or 'high'
6. impact_score: 0-100
7. feasibility_score: 0-100
8. quadrant: 'quick_wins', 'strategic', 'moonshots', or 'research'

Return as a JSON array of objects."""

            response = client.messages.create(
                model=settings.OPENAI_MODEL,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            content = response.content[0].text
            # Extract JSON from response
            try:
                start_idx = content.find('[')
                end_idx = content.rfind(']') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = content[start_idx:end_idx]
                    return json.loads(json_str)
            except (json.JSONDecodeError, ValueError):
                pass

            # Fallback if parsing fails
            return AIService._generate_use_cases_fallback(industry, problems)

        except Exception as e:
            print(f"OpenAI API error: {e}")
            return AIService._generate_use_cases_fallback(industry, problems)

    @staticmethod
    def _generate_use_cases_fallback(
        industry: str,
        problems: List[str]
    ) -> List[Dict[str, Any]]:
        """Rule-based fallback for use case generation."""
        use_cases_by_industry = {
            "finance": [
                {
                    "use_case": "Fraud Detection",
                    "description": "Real-time detection of fraudulent transactions using ML models",
                    "prediction_target": "Transaction fraud probability",
                    "expected_roi": 35.0,
                    "complexity": "medium",
                    "impact_score": 92,
                    "feasibility_score": 85,
                    "quadrant": "quick_wins"
                },
                {
                    "use_case": "Credit Scoring",
                    "description": "Improved credit assessment with alternative data sources",
                    "prediction_target": "Credit risk",
                    "expected_roi": 28.0,
                    "complexity": "medium",
                    "impact_score": 85,
                    "feasibility_score": 80,
                    "quadrant": "strategic"
                },
                {
                    "use_case": "Portfolio Optimization",
                    "description": "AI-driven portfolio rebalancing and risk management",
                    "prediction_target": "Optimal asset allocation",
                    "expected_roi": 42.0,
                    "complexity": "high",
                    "impact_score": 88,
                    "feasibility_score": 72,
                    "quadrant": "strategic"
                }
            ],
            "retail": [
                {
                    "use_case": "Demand Forecasting",
                    "description": "Predict inventory needs to reduce stockouts and overstock",
                    "prediction_target": "Product demand",
                    "expected_roi": 22.0,
                    "complexity": "medium",
                    "impact_score": 80,
                    "feasibility_score": 88,
                    "quadrant": "quick_wins"
                },
                {
                    "use_case": "Customer Segmentation",
                    "description": "Identify high-value customer segments for targeted marketing",
                    "prediction_target": "Customer lifetime value",
                    "expected_roi": 18.0,
                    "complexity": "low",
                    "impact_score": 75,
                    "feasibility_score": 90,
                    "quadrant": "quick_wins"
                },
                {
                    "use_case": "Churn Prediction",
                    "description": "Identify at-risk customers before they leave",
                    "prediction_target": "Customer churn probability",
                    "expected_roi": 25.0,
                    "complexity": "medium",
                    "impact_score": 82,
                    "feasibility_score": 85,
                    "quadrant": "strategic"
                }
            ],
            "healthcare": [
                {
                    "use_case": "Disease Prediction",
                    "description": "Early detection of diseases from patient data",
                    "prediction_target": "Disease risk",
                    "expected_roi": 38.0,
                    "complexity": "high",
                    "impact_score": 95,
                    "feasibility_score": 75,
                    "quadrant": "strategic"
                },
                {
                    "use_case": "Treatment Optimization",
                    "description": "Personalized treatment recommendations based on patient profiles",
                    "prediction_target": "Treatment outcome",
                    "expected_roi": 32.0,
                    "complexity": "high",
                    "impact_score": 90,
                    "feasibility_score": 70,
                    "quadrant": "moonshots"
                },
                {
                    "use_case": "Resource Planning",
                    "description": "Optimize staff and equipment allocation",
                    "prediction_target": "Resource demand",
                    "expected_roi": 20.0,
                    "complexity": "medium",
                    "impact_score": 78,
                    "feasibility_score": 82,
                    "quadrant": "quick_wins"
                }
            ],
            "manufacturing": [
                {
                    "use_case": "Predictive Maintenance",
                    "description": "Prevent equipment failures with condition-based maintenance",
                    "prediction_target": "Equipment failure probability",
                    "expected_roi": 40.0,
                    "complexity": "medium",
                    "impact_score": 88,
                    "feasibility_score": 84,
                    "quadrant": "quick_wins"
                },
                {
                    "use_case": "Quality Control",
                    "description": "Automated defect detection in production",
                    "prediction_target": "Product quality issues",
                    "expected_roi": 28.0,
                    "complexity": "high",
                    "impact_score": 85,
                    "feasibility_score": 78,
                    "quadrant": "strategic"
                }
            ]
        }

        # Get use cases for industry or default set
        industry_lower = industry.lower()
        candidates = use_cases_by_industry.get(industry_lower, use_cases_by_industry["finance"])

        # Filter based on problems if possible
        if problems:
            problem_keywords = " ".join(problems).lower()

            # Simple keyword matching
            filtered = []
            for uc in candidates:
                if any(kw in uc["description"].lower() for kw in problem_keywords.split()):
                    filtered.append(uc)

            # If filtering removes everything, return all
            if filtered:
                return filtered

        return candidates[:5]  # Return top 5

    @staticmethod
    def generate_architecture(
        project_name: str,
        arch_type: str,
        include_monitoring: bool = True,
        include_feature_store: bool = True
    ) -> Dict[str, Any]:
        """
        Generate ML pipeline architecture.
        Uses OpenAI if available, otherwise uses templates.
        """
        if AIService.has_openai():
            return AIService._generate_architecture_openai(
                project_name, arch_type, include_monitoring, include_feature_store
            )
        else:
            return AIService._generate_architecture_fallback(
                project_name, arch_type, include_monitoring, include_feature_store
            )

    @staticmethod
    def _generate_architecture_openai(
        project_name: str,
        arch_type: str,
        include_monitoring: bool = True,
        include_feature_store: bool = True
    ) -> Dict[str, Any]:
        """Generate architecture using OpenAI."""
        try:
            import openai

            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

            prompt = f"""You are an ML architecture expert.

Project: {project_name}
Architecture Type: {arch_type}
Include Monitoring: {include_monitoring}
Include Feature Store: {include_feature_store}

Design an ML architecture with these components. For each component provide:
1. name: Component name
2. description: What it does
3. build_or_buy: 'build' or 'buy'
4. examples: List of 2-3 tools/services

Include essential components like data ingestion, preprocessing, training, serving, and evaluation.

Return as JSON with 'components' array."""

            response = client.messages.create(
                model=settings.OPENAI_MODEL,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            content = response.content[0].text
            try:
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = content[start_idx:end_idx]
                    return json.loads(json_str)
            except (json.JSONDecodeError, ValueError):
                pass

            return AIService._generate_architecture_fallback(
                project_name, arch_type, include_monitoring, include_feature_store
            )

        except Exception as e:
            print(f"OpenAI API error: {e}")
            return AIService._generate_architecture_fallback(
                project_name, arch_type, include_monitoring, include_feature_store
            )

    @staticmethod
    def _generate_architecture_fallback(
        project_name: str,
        arch_type: str,
        include_monitoring: bool = True,
        include_feature_store: bool = True
    ) -> Dict[str, Any]:
        """Template-based architecture fallback."""
        base_components = [
            {
                "name": "Data Ingestion",
                "description": "Collect data from various sources",
                "build_or_buy": "buy",
                "examples": ["Apache Kafka", "AWS Kinesis", "Google Pub/Sub"]
            },
            {
                "name": "Data Storage",
                "description": "Store raw and processed data",
                "build_or_buy": "buy",
                "examples": ["PostgreSQL", "S3", "Google Cloud Storage"]
            },
            {
                "name": "Data Processing",
                "description": "ETL and data preparation",
                "build_or_buy": "buy",
                "examples": ["Apache Spark", "dbt", "Airflow"]
            },
        ]

        if include_feature_store:
            base_components.append({
                "name": "Feature Store",
                "description": "Manage ML features for training and serving",
                "build_or_buy": "buy",
                "examples": ["Tecton", "Feast", "Vertex Feature Store"]
            })

        if arch_type in ["real_time", "hybrid"]:
            base_components.extend([
                {
                    "name": "Model Training",
                    "description": "Train ML models with historical data",
                    "build_or_buy": "build",
                    "examples": ["PyTorch", "TensorFlow", "scikit-learn"]
                },
                {
                    "name": "Model Serving",
                    "description": "Deploy and serve predictions in real-time",
                    "build_or_buy": "buy",
                    "examples": ["TensorFlow Serving", "Seldon", "KServe"]
                }
            ])
        else:
            base_components.extend([
                {
                    "name": "Model Training",
                    "description": "Train ML models with historical data",
                    "build_or_buy": "build",
                    "examples": ["PyTorch", "TensorFlow", "scikit-learn"]
                },
                {
                    "name": "Batch Prediction",
                    "description": "Generate predictions in batch",
                    "build_or_buy": "build",
                    "examples": ["Apache Spark", "Kubernetes", "AWS Batch"]
                }
            ])

        if include_monitoring:
            base_components.extend([
                {
                    "name": "Monitoring & Logging",
                    "description": "Track model performance and system health",
                    "build_or_buy": "buy",
                    "examples": ["Prometheus", "DataDog", "New Relic"]
                },
                {
                    "name": "Model Evaluation",
                    "description": "Assess model performance and drift",
                    "build_or_buy": "build",
                    "examples": ["MLflow", "Weights & Biases", "Neptune"]
                }
            ])

        return {"components": base_components}

    @staticmethod
    def generate_roadmap(
        duration_months: int,
        maturity_level: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate implementation roadmap.
        Uses OpenAI if available, otherwise uses templates.
        """
        if AIService.has_openai():
            return AIService._generate_roadmap_openai(duration_months, maturity_level)
        else:
            return AIService._generate_roadmap_fallback(duration_months, maturity_level)

    @staticmethod
    def _generate_roadmap_openai(
        duration_months: int,
        maturity_level: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Generate roadmap using OpenAI."""
        try:
            import openai

            client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

            prompt = f"""You are an AI transformation roadmap expert.

Duration: {duration_months} months
Maturity Level: {maturity_level or 'intermediate'}

Create a phased roadmap with 3 phases. For each phase provide:
1. phase_number: 1, 2, or 3
2. name: Phase name
3. description: What's accomplished
4. duration_months: How many months
5. milestones: Array of {{name, description, timeline_weeks}}
6. deliverables: Array of deliverable strings

Return as JSON with 'phases' array."""

            response = client.messages.create(
                model=settings.OPENAI_MODEL,
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            content = response.content[0].text
            try:
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                if start_idx >= 0 and end_idx > start_idx:
                    json_str = content[start_idx:end_idx]
                    result = json.loads(json_str)
                    return result.get("phases", [])
            except (json.JSONDecodeError, ValueError):
                pass

            return AIService._generate_roadmap_fallback(duration_months, maturity_level)

        except Exception as e:
            print(f"OpenAI API error: {e}")
            return AIService._generate_roadmap_fallback(duration_months, maturity_level)

    @staticmethod
    def _generate_roadmap_fallback(
        duration_months: int,
        maturity_level: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Template-based roadmap fallback."""
        months_per_phase = max(1, duration_months // 3)

        phases = [
            {
                "phase_number": 1,
                "name": "Foundation & Assessment",
                "description": "Establish AI strategy, assess current maturity, and build initial team",
                "duration_months": months_per_phase,
                "milestones": [
                    {
                        "name": "AI Strategy Alignment",
                        "description": "Define AI vision and business objectives",
                        "timeline_weeks": 2
                    },
                    {
                        "name": "Organizational Readiness",
                        "description": "Assess skills, infrastructure, and governance",
                        "timeline_weeks": 3
                    },
                    {
                        "name": "Pilot Project Selection",
                        "description": "Identify and scope first AI project",
                        "timeline_weeks": 2
                    }
                ],
                "deliverables": [
                    "AI Strategy Document",
                    "Maturity Assessment Report",
                    "Governance Framework",
                    "Pilot Project Charter"
                ]
            },
            {
                "phase_number": 2,
                "name": "Pilot & Scale",
                "description": "Execute pilot project and establish ML infrastructure",
                "duration_months": months_per_phase,
                "milestones": [
                    {
                        "name": "Infrastructure Setup",
                        "description": "Deploy data and ML platforms",
                        "timeline_weeks": 4
                    },
                    {
                        "name": "Pilot Execution",
                        "description": "Build and train first models",
                        "timeline_weeks": 6
                    },
                    {
                        "name": "Pilot Evaluation",
                        "description": "Measure results and ROI",
                        "timeline_weeks": 2
                    }
                ],
                "deliverables": [
                    "Data Platform Setup",
                    "ML Model (Pilot)",
                    "Pilot Results Report",
                    "Scaling Plan"
                ]
            },
            {
                "phase_number": 3,
                "name": "Operationalization & Growth",
                "description": "Productionize models and expand to multiple use cases",
                "duration_months": max(1, duration_months - 2 * months_per_phase),
                "milestones": [
                    {
                        "name": "MLOps Implementation",
                        "description": "Automate model deployment and monitoring",
                        "timeline_weeks": 4
                    },
                    {
                        "name": "Multi-Project Rollout",
                        "description": "Launch additional AI projects",
                        "timeline_weeks": 8
                    },
                    {
                        "name": "Team Scaling",
                        "description": "Hire and develop AI/ML talent",
                        "timeline_weeks": 4
                    }
                ],
                "deliverables": [
                    "MLOps Pipeline",
                    "Model Monitoring Dashboard",
                    "Additional Production Models",
                    "AI Center of Excellence"
                ]
            }
        ]

        return phases

    @staticmethod
    def generate_recommendations(scores: Dict[str, float]) -> List[str]:
        """Generate recommendations based on domain scores."""
        recommendations = []

        # Strategy recommendations
        if scores.get("strategy", 0) < 3:
            recommendations.append(
                "Define a clear AI strategy aligned with business objectives"
            )
        if scores.get("strategy", 0) < 2:
            recommendations.append(
                "Establish executive sponsorship and governance for AI initiatives"
            )

        # Infrastructure recommendations
        if scores.get("infrastructure", 0) < 3:
            recommendations.append(
                "Invest in cloud infrastructure and data platforms"
            )
        if scores.get("infrastructure", 0) < 2:
            recommendations.append(
                "Modernize legacy systems to support AI workloads"
            )

        # Data recommendations
        if scores.get("data", 0) < 3:
            recommendations.append(
                "Improve data quality, governance, and accessibility"
            )
        if scores.get("data", 0) < 2:
            recommendations.append(
                "Establish data engineering team and data pipelines"
            )

        # People recommendations
        if scores.get("people", 0) < 3:
            recommendations.append(
                "Hire or develop AI/ML talent internally"
            )
        if scores.get("people", 0) < 2:
            recommendations.append(
                "Partner with external AI/ML consultants or agencies"
            )

        # Governance recommendations
        if scores.get("governance", 0) < 3:
            recommendations.append(
                "Establish AI ethics and compliance framework"
            )
        if scores.get("governance", 0) < 2:
            recommendations.append(
                "Create responsible AI and model governance policies"
            )

        return recommendations
