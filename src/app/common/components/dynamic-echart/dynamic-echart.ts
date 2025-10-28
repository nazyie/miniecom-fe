import { Component, Input, OnInit } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts/core';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart, LineChart, PieChart } from 'echarts/charts';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
]);

@Component({
  selector: 'app-dynamic-echart',
  imports: [NgxEchartsDirective],
  templateUrl: './dynamic-echart.html',
  styleUrl: './dynamic-echart.css',
  providers: [provideEchartsCore({ echarts })],
})
export class DynamicEchart implements OnInit {
  /** Default chart type */
  @Input() chartType: 'pie-chart' | 'bar-chart' | 'line-chart' = 'line-chart';

  /** Default data for testing */
  @Input() data: { value: number; name: string }[] = [
    { value: 820, name: 'Mon' },
    { value: 932, name: 'Tue' },
    { value: 901, name: 'Wed' },
    { value: 934, name: 'Thu' },
    { value: 1290, name: 'Fri' },
    { value: 1330, name: 'Sat' },
    { value: 1320, name: 'Sun' },
  ];

  @Input() chartTitle: string = 'Chart Title';

  chartOption: EChartsCoreOption = {};

  ngOnInit(): void {
    this.chartOption = this.generateChartOption();
  }

  private generateChartOption(): EChartsCoreOption {
    const names = this.data.map(d => d.name);
    const values = this.data.map(d => d.value);

    if (this.chartType === 'pie-chart') {
      return {
        backgroundColor: 'transparent',
        title: {
          text: this.chartTitle || 'Sales Overview',
          left: 'center',
          top: 0, // move slightly down to prevent collision
          textStyle: {
            color: '#1f2937', // Tailwind gray-800
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          top: '10%',
          left: 'center',
          textStyle: {
            color: '#6b7280', // Tailwind gray-500
            fontSize: 12,
          },
          itemGap: 10,
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['45%', '70%'],
            center: ['50%', '60%'], // move chart lower to avoid overlap
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 10,
                fontWeight: 'bold'
              }
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' },
            ],
          },
        ],
      };

    }

    if (this.chartType === 'bar-chart') {
      const colors = [
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#8b5cf6', // violet-500
        '#06b6d4', // cyan-500
        '#ec4899', // pink-500
      ];

      const colorizedData = values.map((v, i) => ({
        value: v,
        itemStyle: { color: colors[i % colors.length] },
      }));

      return {
        backgroundColor: 'transparent',
        title: {
          text: this.chartTitle || 'Sales Overview',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#1f2937', // gray-800
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: '#1f2937',
          textStyle: { color: '#f9fafb' },
          borderWidth: 0,
        },
        grid: {
          top: 60,
          left: 40,
          right: 20,
          bottom: 40,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLine: { lineStyle: { color: '#d1d5db' } }, // gray-300
          axisLabel: { color: '#374151', fontSize: 12 },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: '#e5e7eb' } }, // gray-200
          axisLabel: { color: '#374151', fontSize: 12 },
        },
        series: [
          {
            name: 'Sales',
            data: colorizedData,
            type: 'bar',
            barWidth: '45%',
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
            },
            label: {
              show: true,
              position: 'top',
              color: '#374151',
              fontWeight: '500',
              fontSize: 12,
            },
          },
        ],
        animationDuration: 800,
        animationEasing: 'cubicOut',
      };
    }


    return {
      title: {
        text: this.chartTitle,
        left: 'center',
        top: 10,
        textStyle: {
          color: '#1f2937', // neutral gray
          fontSize: 14,
          fontWeight: '600',
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderWidth: 0,
        textStyle: { color: '#fff' },
        axisPointer: {
          type: 'line',
          lineStyle: { color: '#93c5fd', width: 2 },
        },
      },
      grid: {
        top: 60,
        left: 30,
        right: 30,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#d1d5db' } },
        axisLabel: { color: '#6b7280' },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#e5e7eb' } },
        axisLabel: { color: '#6b7280' },
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          showSymbol: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ]),
          },
          lineStyle: {
            color: '#3b82f6',
            width: 3,
          },
          itemStyle: {
            color: '#3b82f6',
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            scale: true,
            itemStyle: {
              color: '#2563eb',
              borderColor: '#fff',
              borderWidth: 2,
            },
          },
        },
      ],
    };

  }

}
