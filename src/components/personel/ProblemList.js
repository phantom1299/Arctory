import React, { Component } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Dimensions
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import { CheckBox, Item, Input, Button, Spinner, Toast, Icon } from 'native-base'

import { MyText as Text } from '../common'
import { getProblems, getProblemCodes, postSolution } from '../../api'

const solutions = {
  0: [
    {
      details: 'Sifon değiştirildi'
    }
  ],
  1: [
    {
      details: 'Musluk değiştirildi'
    },
    {
      details: 'Musluk tamir edildi'
    }
  ],
  2: [
    {
      details: 'Yeni sabun eklendi'
    },
    {
      details: 'Sabunluk değiştirildi'
    }
  ],
  3: [
    {
      details: 'Kağıt sıkışmış'
    }
  ],
  4: [
    {
      details: 'Tuvalet Temizlendi'
    }
  ],
  5: [
    {
      details: 'Ambul Değiştirildi'
    }
  ]
}

class Problems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      loadingProblemCodes: true,
      loadingProblems: true,
      problems: [],
      problemCodes: [],
      selectedProblem: {},
      checkedSolutionIndex: null,
      solutions: [],
      solutionText: ''
    }

    this.onRowOpen = this.onRowOpen.bind(this)
  }

  componentDidMount() {
    getProblemCodes(this.props.tenantId)
      .then(response => (response.ok ? response.json() : Promise.reject(response.statusText)))
      .then(result => this.setState({ loadingProblemCodes: false, problemCodes: result }))
      .catch(err => {
        this.setState({ loadingProblemCodes: false })
        Toast.show({
          text: 'Sorunları çekilirken bir hata oluştu',
          duration: 2000,
          type: 'danger',
          position: 'bottom'
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.toiletId !== '') {
      this.setState({ loadingProblems: true })
      getProblems(this.props.tenantId, this.props.toiletId)
        .then(response => (response.ok ? response.json() : Promise.reject(response.statusText)))
        .then(result => this.setState({ loadingProblems: false, problems: result }))
        .catch(err => {
          this.setState({ loadingProblemCodes: false })
          Toast.show({
            text: 'Sorunları çekilirken bir hata oluştu',
            duration: 2000,
            type: 'danger',
            position: 'bottom'
          })
        })
    }
  }

  onRowOpen = (rowKey, rowMap) => {
    // console.log(this.state.problems.find(e => e._id === rowKey))
    const selectedProblem = this.state.problems.find(e => e._id === rowKey)
    this.setState({
      closeSelectedRow: () => this.closeRow(rowMap, rowKey),
      deleteRow: () => this.deleteRow(rowMap, rowKey),
      visible: true,
      selectedProblem,
      solutions: this.getSolutionsForProblem(selectedProblem.problemCode)
    })
  }

  onPressOk = () => {
    const { _id, toiletId, problemCode, problemDate } = this.state.selectedProblem
    console.log({ _id, toiletId, problemCode, problemDate })
    this.setState({ loading: true })
    postSolution(this.props.tenantId, {
      toiletId,
      problemId: _id,
      problemCode,
      problemDate,
      details: this.state.solutionText
    })
      .then(
        response =>
          response.ok
            ? this.setState({ visible: false, loading: false }, () => {
                Toast.show({
                  text: 'Sorun çözüldü',
                  duration: 2000,
                  type: 'success',
                  position: 'bottom'
                })
                this.state.deleteRow()
              })
            : Promise.reject(response.statusText)
      )
      .catch(err => {
        this.setState({ loading: false })
        Toast.show({
          text: 'Sorun çözülürken bir hata oluştu, lütfen tekrar deneyin',
          duration: 2000,
          type: 'danger',
          position: 'bottom'
        })
      })
  }

  getSolutionsForProblem = code => {
    return solutions[code] ? solutions[code] : []
  }

  getProblemDescription = code => {
    const problem = this.state.problemCodes.find(e => e.code === code)
    if (problem) {
      return problem.description
    }
    return 'Bilinmiyor'
  }

  keyExtractor = (item, index) => item._id

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow()
    }
  }

  deleteRow(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey)
    const newData = [...this.state.problems]
    const prevIndex = this.state.problems.findIndex(item => item._id === rowKey)
    newData.splice(prevIndex, 1)
    this.setState({ problems: newData })
  }

  renderIcon = code => {
    switch (code) {
      case '1':
        return (
          <Icon
            style={{ color: '#000', padding: 10 }}
            ios="ios-water-outline"
            android="ios-water-outline"
          />
        )
      case '2':
        return (
          <Icon
            style={{ color: '#000', padding: 10 }}
            ios="ios-egg-outline"
            android="ios-egg-outline"
          />
        )
      case '3':
        return (
          <Icon
            style={{ color: '#000', padding: 10 }}
            ios="ios-remove-circle-outline"
            android="ios-remove-circle-outline"
          />
        )
      case '4':
        return <Icon style={{ color: '#000', padding: 10 }} ios="ios-bug" android="ios-bug" />
      case '5':
        return <Icon style={{ color: '#000', padding: 10 }} ios="ios-bulb" android="ios-bulb" />
      default:
        return null
    }
  }

  renderModal() {
    return (
      <Modal
        onRequestClose={() => this.setState({ visible: false }, this.state.closeSelectedRow)}
        visible={this.state.visible}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => this.setState({ visible: false }, this.state.closeSelectedRow)}
        >
          <View
            style={{ flex: 1, backgroundColor: '#000a', justifyContent: 'center', padding: '5%' }}
          >
            <TouchableWithoutFeedback style={{ flex: 1 }}>
              <View style={{ backgroundColor: '#fff', padding: 15 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 10 }}>
                  {this.getProblemDescription(this.state.selectedProblem.problemCode)}
                </Text>
                <Text>Lütfen sorunu nasıl çözdüğünüzü seçiniz...</Text>
                {this.state.solutions.map((e, i) => (
                  <TouchableOpacity
                    key={e.details}
                    onPress={() =>
                      this.setState({ checkedSolutionIndex: i, solutionText: e.details })
                    }
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <CheckBox
                      onPress={() =>
                        this.setState({ checkedSolutionIndex: i, solutionText: e.details })
                      }
                      checked={this.state.checkedSolutionIndex === i}
                    />
                    <Text style={{ padding: 15, marginLeft: 15 }}>{e.details}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => this.setState({ checkedSolutionIndex: -1, solutionText: '' })}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <CheckBox
                    onPress={() => this.setState({ checkedSolutionIndex: -1, solutionText: '' })}
                    checked={this.state.checkedSolutionIndex === -1}
                  />
                  <Text style={{ padding: 15, marginLeft: 15 }}>Diğer</Text>
                </TouchableOpacity>
                {this.state.checkedSolutionIndex === -1 && (
                  <Item>
                    <Input
                      value={this.state.solutionText}
                      onChangeText={text => this.setState({ solutionText: text })}
                      placeholder="Açıklama..."
                    />
                  </Item>
                )}
                {this.state.loading ? (
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Spinner />
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button transparent onPress={this.onPressOk}>
                      <Text
                        style={{
                          color: 'steelblue',
                          paddingHorizontal: 10,
                          fontSize: 18,
                          fontWeight: 'bold'
                        }}
                      >
                        Tamam
                      </Text>
                    </Button>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  renderEmpty() {
    return (
      <View style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height * 0.7, justifyContent: 'center', padding: '10%' }}>
        <Image
          source={{
            uri: 'http://michellesread.com/files/2013/04/smile.jpg'
          }}
          style={{
              resizeMode: 'contain',
              width: '70%',
              alignSelf: 'center',
              flex: 2
          }}
        />
        <Text style={{ textAlign: 'center', paddingBottom: 20 }}>
          Seçili tuvalete ait bir sorun bulunamadı. Hadi iyisin ;)
        </Text>
        <Button style={{ marginHorizontal: '10%' }} success full onPress={this.props.openQR}>
          <Text style={{ color: '#fff' }}>BAŞKA KAREKOD OKUT</Text>
        </Button>
      </View>
    )
  }

  render() {
    if (this.props.toiletId === '') {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: '10%' }}>
            <Text style={{ textAlign: 'center', paddingBottom: 20 }}>
              Seçili bir tuvalete ait sorunları görebilmek için lütfen tuvaletin karekodunu okut.
            </Text>
            <Button style={{ marginHorizontal: '10%' }} success full onPress={this.props.openQR}>
              <Text style={{ color: '#fff' }}>KAREKOD OKUT</Text>
            </Button>
          </View>
        </View>
      )
    }
    if (this.state.loadingProblemCodes || this.state.loadingProblems) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {this.renderModal()}
        <SwipeListView
          keyExtractor={this.keyExtractor}
          useFlatList
          data={this.state.problems}
          renderItem={({ item }, rowMap) => (
            <View style={styles.rowFront}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingLeft: 20
                }}
              >
                <View style={{ width: 45, alignItems: 'center' }}>
                  {this.renderIcon(item.problemCode)}
                </View>
                <Text>{this.getProblemDescription(item.problemCode)}</Text>
              </View>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <Text />
            </View>
          )}
          ListEmptyComponent={this.renderEmpty()}
          disableRightSwipe
          rightOpenValue={-150}
          onRowOpen={this.onRowOpen}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowFront: {
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    height: 50
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0
  }
})

export default Problems
