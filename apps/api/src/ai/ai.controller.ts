import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AiService, RiskScoreInput } from './ai.service.js';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('risk-score')
  async getRiskScore(@Body() body: RiskScoreInput) {
    return this.aiService.predictRiskScore(body);
  }

  @Get('project/:projectId')
  async analyzeProject(@Param('projectId') projectId: string) {
    return this.aiService.analyzeProject(projectId);
  }

  @Post('grievance-suggest')
  async suggestGrievance(
    @Body() body: { category: string; description: string },
  ) {
    return this.aiService.suggestGrievance(body.category, body.description);
  }
}
