import React, { Component } from 'react'
import { View } from 'react-native'
import { Toast, Spinner } from 'native-base'
import { MyText as Text } from '../common'
import { getDistributionOfProblemTypes } from '../../api'
import PieChart from './PieChart'

class PieChartScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      problemCodes: props.problemCodes,
      data: []
    }
  }

  componentDidMount() {
    getDistributionOfProblemTypes(this.props.tenantId)
      .then(response => (response.ok ? response.json() : Promise.reject(response.statusText)))
      .then(result => this.setState({ loading: false, data: result }))
      .catch(err => {
        this.setState({ loading: false })
        Toast.show({
          text: 'Rapor çekilirken bir hata oluştu',
          duration: 2000,
          type: 'danger',
          position: 'bottom'
        })
      })
  }
  render = () => {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </View>
      )
    }
    return <PieChart problemCodes={this.state.problemCodes} data={this.state.data} />
  }
}

export default PieChartScreen
