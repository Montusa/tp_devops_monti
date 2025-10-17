import { Injectable } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  public httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total de requests HTTP',
    labelNames: ['method', 'route', 'status_code'],
  });

  public httpRequestDuration = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duración de requests HTTP en ms',
    labelNames: ['method', 'route'],
    buckets: [0.1, 5, 15, 50, 100, 500],
  });
}
