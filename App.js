import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library'

const PlaceholderImage = require('./assets/images/background-image.png');

export default function App() {
  const imageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();

  if(status === null){
      requestPermission();
  }

  const onReset = () =>{
    setShowAppOptions(false);
    setSelectedImage(null);
  }

  const onAddSticker = () => {
    // console.log("Add Sticker Clicked!");
    setIsModalVisible(true);
  };

  const onSelectEmoji = (item) => {
    console.log(item);
    setPickedEmoji(item);
  }

  const onSaveImageAsync = async () => {
    // console.log("Inside Save Image Method...");
    
    if(Platform.OS!== 'web'){
      try{
        const localUri = await captureRef(imageRef,{
          height: 440,
          quality: 1,
        });
        // console.log("localUri before save:",localUri);
        await MediaLibrary.saveToLibraryAsync(localUri);
        // console.log("localUri:",localUri);
        if(localUri){
          alert("Image Saved!");
        }
      }catch(e){
        console.log(e)
      }
    }
  };

  const onModalClose = () => {
    setIsModalVisible(false);
    // console.log("Modal Close Clicked with:", isModalVisible);
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    })
    
    if(!result.canceled){
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    }else{
      alert('Choose an Image Yoyo!');
    }
  }



  return (
    <GestureHandlerRootView >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
            {pickedEmoji && <EmojiSticker imageSize={44} stickerSource={pickedEmoji}/>}
          </View>
        </View>
        { showAppOptions? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon={"refresh"} label={"Reset"}  onPress={()=>onReset()}/>
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon={"save-alt"} label={"Save"} onPress={onSaveImageAsync}/>
            </View>
          </View>
        ):(
          <View style={styles.footerContainer} >
            <Button theme="primary" label={"Choose a Picture"} onPress={pickImageAsync}/>
            <Button label={"Use this Photo"} onPress={()=> setShowAppOptions(true)}/>
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={onSelectEmoji} onCloseModal={onModalClose}/>
        </EmojiPicker>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
