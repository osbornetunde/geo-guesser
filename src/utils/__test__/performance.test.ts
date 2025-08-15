import { getPerformanceData } from '../performance';

describe('getPerformanceData', () => {
  it('returns "Outstanding" for percentage >= 90', () => {
    const data = getPerformanceData(95);
    expect(data.message).toContain('Outstanding');
  });

  it('returns "Excellent" for percentage >= 75 and < 90', () => {
    const data = getPerformanceData(80);
    expect(data.message).toContain('Excellent');
  });

  it('returns "Well done" for percentage >= 60 and < 75', () => {
    const data = getPerformanceData(65);
    expect(data.message).toContain('Well done');
  });

  it('returns "Good effort" for percentage >= 40 and < 60', () => {
    const data = getPerformanceData(50);
    expect(data.message).toContain('Good effort');
  });

  it('returns "Keep exploring" for percentage < 40', () => {
    const data = getPerformanceData(30);
    expect(data.message).toContain('Keep exploring');
  });
});
