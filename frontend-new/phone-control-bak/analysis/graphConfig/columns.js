export const series = [{
  name: '次数',
  data: [19, 14, 12, 11, 1, 3, 5, 13, 12, 14, 16, 2]
}]

export const chartOptions = {
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },

  xaxis: {
    categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    title: {
      text: '营',
      style: {
        fontSize: '14px'
      }
    }
  },
  yaxis: {
    title: {
      text: '次数',
      style: {
        fontSize: '14px'
      }
    }
  },
  fill: {
    opacity: 1

  },
  tooltip: {
    y: {
      formatter: function(val) {
        return '违规' + val + '次'
      }
    }
  },
  title: {
    text: '敏感词使用次数',
    align: 'center',
    style: {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  }
}
