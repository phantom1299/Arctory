import React from 'react'
import { StyleSheet, Text, View, processColor } from 'react-native'

import { SafeAreaView } from 'react-navigation'

import { PieChart } from 'react-native-charts-wrapper'

class PieChartScreen extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      legend: {
        enabled: true,
        textSize: 16,
        form: 'SQUARE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true
      },
      data: {
        dataSets: [
          {
            values: this.getValues(props.data),
            label: '',
            config: {
              colors: [
                processColor('#C0FF8C'),
                processColor('#FFF78C'),
                processColor('#FFD08C'),
                processColor('#8CEAFF'),
                processColor('#FF8C9D')
              ],
              valueTextSize: 20,
              valueTextColor: processColor('green'),
              valueFormatter: "#.0'%'",
              sliceSpace: 5,
              selectionShift: 13
            }
          }
        ]
      },
      highlights: [{ x: 2 }],
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

  getValues = data => {
    const total = data.reduce((prev, curr) => prev + curr.count, 0)
    return data.map(({ _id, count }) => ({
      value: count / total,
      label: this.getProblemDescription(_id)
    }))
    // [
    //   ({ value: 40, label: 'Sandwiches' },
    //   { value: 21, label: 'Salads' },
    //   { value: 15, label: 'Soup' },
    //   { value: 9, label: 'Beverages' },
    //   { value: 15, label: 'Desserts' })
    // ]
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
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        {/* <View>
          <Text>selected:</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View> */}

        <View style={styles.container}>
          <PieChart
            style={styles.chart}
            logEnabled
            chartBackgroundColor={processColor('white')}
            chartDescription={this.state.description}
            data={this.state.data}
            legend={this.state.legend}
            highlights={this.state.highlights}
            entryLabelColor={processColor('black')}
            entryLabelTextSize={14}
            drawEntryLabels={false}
            rotationEnabled={false}
            rotationAngle={45}
            usePercentValues
            styledCenterText={{ text: 'Sorunlar', color: processColor('black'), size: 20 }}
            centerTextRadiusPercent={100}
            holeRadius={40}
            holeColor={processColor('#f0f0f0')}
            transparentCircleRadius={45}
            transparentCircleColor={processColor('#f0f0f088')}
            maxAngle={350}
            onSelect={this.handleSelect.bind(this)}
            onChange={event => console.log(event.nativeEvent)}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chart: {
    flex: 1
  }
})

export default PieChartScreen
