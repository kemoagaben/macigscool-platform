"""Live system metrics endpoints.

The live metrics API provides insight into the operational status of
the system. These endpoints return fabricated data representing
typical metrics such as CPU usage, request latency and error rates.
Integrate your monitoring solution here to serve real data.
"""

from __future__ import annotations

import datetime
import random
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

live_metrics_bp = Blueprint('live_metrics_bp', __name__)


def _generate_metric_point(offset_minutes: int) -> dict[str, float]:
    """Generate a single metric point for demonstration purposes."""
    timestamp = (datetime.datetime.utcnow() - datetime.timedelta(minutes=offset_minutes)).isoformat() + 'Z'
    return {
        "timestamp": timestamp,
        "cpu": round(random.uniform(10, 90), 2),
        "response_time_ms": round(random.uniform(100, 500), 2),
        "error_rate": round(random.uniform(0, 5), 2),
    }


@live_metrics_bp.route('/live-metrics/current', methods=['GET'])
@jwt_required()
def current_metrics():
    """Return the current snapshot of system metrics."""
    point = _generate_metric_point(0)
    return jsonify(point)


@live_metrics_bp.route('/live-metrics/historical', methods=['GET'])
@jwt_required()
def historical_metrics():
    """Return a list of historical metric points for the last hour."""
    points = [_generate_metric_point(i) for i in range(0, 60, 5)]
    return jsonify(points)


@live_metrics_bp.route('/live-metrics/alerts', methods=['GET'])
@jwt_required()
def metrics_alerts():
    """Return active alerts based on thresholds."""
    alerts = []
    # Example alerts – in a real system you'd evaluate the metrics
    # against thresholds and only return active alerts
    alerts.append({"type": "uptime", "level": "warning", "message": "Uptime below 99.9%"})
    alerts.append({"type": "latency", "level": "critical", "message": "Average response time above 400 ms"})
    return jsonify(alerts)


@live_metrics_bp.route('/live-metrics/summary', methods=['GET'])
@jwt_required()
def metrics_summary():
    """Return a summary of system metrics (aggregated over a day)."""
    summary = {
        "average_cpu": 55.0,
        "average_response_time_ms": 250.0,
        "error_rate": 1.2,
    }
    return jsonify(summary)