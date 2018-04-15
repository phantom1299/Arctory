import React from 'react'
import { AppRegistry, StyleSheet, Text, View, processColor } from 'react-native'

import { BarChart } from 'react-native-charts-wrapper'

class BarChartScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      legend: {
        enabled: true,
        textSize: 14,
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5
      },
      data: {
        dataSets: [
          {
            values: this.getValues(props.data),
            label: 'Ortalama Çözüm Süresi',
            config: {
              colors: [
                processColor('#C0FF8C'),
                processColor('#FFF78C'),
                processColor('#FFD08C'),
                processColor('#8CEAFF'),
                processColor('#FF8C9D')
              ],
              barSpacePercent: 40,
              barShadowColor: processColor('lightgrey'),
              highlightAlpha: 90,
              highlightColor: processColor('white'),
              axisDependency: 'left'
            }
          }
        ],
        config: {
          barWidth: 0.4
        }
      },
      xAxis: {
        labelRotationAngle: -60,
        valueFormatter: this.getLabels(props.data),
        granularityEnabled: true,
        granularity: 1
      },
      yAxis: {
        left: {
          axisMinimum: 0,
          labelCount: 7, // 0 5 10 15 20 25 30
          labelCountForce: true,
          granularity: 1,
          granularityEnabled: true,
          valueFormatter: '# dk'
        },
        right: { enabled: false }
      },
      description: {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray')
      }
    }
  }

  getProblemDescription = code => {
    const problem = this.props.problemCodes.find(e => e.code === code)
    if (problem) {
      return problem.description
    }
    return 'Bilinmiyor'
  }

  getLabels = data => {
    return data.map(({ _id }) => this.getProblemDescription(_id))
  }

  getValues = data => {
    return data.map(({ _id, average }) => ({
      y: average / (1000 * 60)
    }))
  }

  handleSelect(event) {
    const entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }

    console.log(event.nativeEvent)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <BarChart
            style={styles.chart}
            data={this.state.data}
            xAxis={this.state.xAxis}
            yAxis={this.state.yAxis}
            animation={{ durationX: 2000 }}
            chartBackgroundColor={processColor('white')}
            chartDescription={this.state.description}
            legend={this.state.legend}
            gridBackgroundColor={processColor('#ffffff')}
            drawBarShadow={false}
            drawValueAboveBar
            drawHighlightArrow
            onSelect={this.handleSelect.bind(this)}
            onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  chart: {
    flex: 1
  }
})

export default BarChartScreen
