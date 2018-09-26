import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import {
  FaceContainer,
  FaceButton,
  ButtonText
} from './Styles'

import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const mutation = gql`
  mutation TrainFace($name: String!, $base64: String!) {
    addFace(name: $name, imageData: $base64) {
      ok
    }
  }
`

class TrainFace extends React.Component {
  static navigationOptions = {
    title: 'Add Face',
    headerStyle: {
      backgroundColor: '#222',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };
  
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    base64Photo: ""
  };
  
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  takePhoto = addFace => async () => {
    if (this.camera) {
      const { base64 } = await this.camera.takePictureAsync({
        base64: true
      })

      try {
        const response = await addFace({variables: {
          name: "JP",
          base64
        }})

        console.log(response)
      } catch (err) {
        console.log("Query Failed")
        console.log(err)
      }
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Mutation mutation={mutation}>
          {
            (addFace, {data}) => (
              <View style={{ flex: 1 }}>
                <Camera ref={ref => { this.camera = ref; }} style={{ flex: 1 }} type={this.state.type}>
                <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                </View>
                  <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                    });
                  }}>
                    <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={this.takePhoto(addFace)}>
                    <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Take Photo{' '}
                    </Text>
                  </TouchableOpacity>
                </Camera>
                </View>
            )
          }
        </Mutation>
      );
    }
  }
  
}

export default TrainFace