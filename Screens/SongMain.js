import { StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  View,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Image,
 } from "react-native";
import { useState, useEffect } from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { myTopTracks, albumTracks } from "../utils/apiOptions";
import { REDIRECT_URI, SCOPES, CLIENT_ID, ALBUM_ID } from "../utils/constants";
import Colors from '../Themes/colors';
import images from '../Themes/images';
import millisToMinutesAndSeconds from "../utils/millisToMinuteSeconds";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


// Endpoints for authorizing with Spotify
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token"
};

export default function SongMain(){
  const navigation = useNavigation();
  StatusBar.setBarStyle("light-content");
  const [token, setToken] = useState("");
  const [tracks, setTracks] = useState([]);
  // Select which option you want: Top Tracks (true) or Album Tracks (false)
  const topTracks = true; 
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: REDIRECT_URI
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    if (token) {
      if (topTracks){
        myTopTracks(setTracks, token);
      } else {
        albumTracks(ALBUM_ID, setTracks, token);
      }
    }
  }, [token]);

  const SpotifyAuthButton = (props) => {
    return (
    <TouchableOpacity style={styles.button} onPress={promptAsync}>
      <Image source={images.spotify} style={styles.logo}/>
      <Text style={styles.buttonText}>CONNECT WITH SPOTIFY</Text>
    </TouchableOpacity>
    );
  }
  
  const Song = (props) => {
    return (
      <TouchableOpacity onPress={()=>{navigation.navigate("SongDetail", {
        external_url: props.external_url
        })}}>
      <View style={styles.song}>
        <TouchableHighlight style={styles.playButton} onPress={()=>{navigation.navigate("SongPreview", {
          preview_url: props.preview_url
        })}}>
          <AntDesign name="play" size={24} color="green" />
        </TouchableHighlight>
        <Image source={{uri: props.imageSrc}} style={styles.songImg} />
        <View style={styles.songNameArtist}>
          <Text style={styles.songText} numberOfLines={1}> {props.name} </Text>
          <Text style={styles.songArtist} numberOfLines={1}> {props.artist} </Text>
        </View>
        <Text style={styles.album} numberOfLines={1}> {props.album} </Text>
        <Text style={styles.songText}> {millisToMinutesAndSeconds(props.ms)} </Text>
      </View>
      </TouchableOpacity>
    );
  }

  const renderItem = (item, index) => {
    // console.log("ITEM",item)
    return (
        <Song 
          trackNum={index} 
          imageSrc={item.album.images[1].url}
          artist={item.artists[0].name}  
          name={item.name}
          album={item.album.name}
          ms={item.duration_ms}
          preview_url={item.preview_url}
          external_url={item.external_urls.spotify}
        />
    );
 }

  let contentDisplayed = null;

  if (token && tracks.length !== 0){
    contentDisplayed = 
          <View>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <Image source={topTracks ? images.spotify : {uri: tracks[0].album.images[1].url}} style={styles.logo}/>
              <Text style={styles.title}>{topTracks ? "My Top Tracks" : tracks[0].album.name}</Text>
            </View>
            <FlatList data={tracks}
                        renderItem={({item, index})=>renderItem(item, index+1)}
                        keyExtractor={(item) => item.id}/>
          </View>
  } else {
    contentDisplayed = <SpotifyAuthButton/>
  }

  return(
    <SafeAreaView style={styles.container}>
      {contentDisplayed}
    </SafeAreaView>
  );

}



const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  button: {
    borderRadius: 99999,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.spotify,
    padding: 10,
  },
  playButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText:{
    color: 'white',
    fontSize: 20,
    paddingLeft: 10,
  },
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  song: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  songText:{
    color: "white",
  },
  songImg: {
    height: 64,
    width: 64,
    marginHorizontal: 10,
    resizeMode: "contain",
  },
  songNameArtist: {
    flexDirection: "column",
    justifyContent: "center",
    width: '35%',
    margin: 2,
  },
  album: {
    color: "white",
    width: "28%",
  },
  songInd: {
    color: "white",
    width: "5%"
  },
  songArtist: {
    color: Colors.gray,
  }, 
  title: {
    color: "white",
    fontSize: 30,
    padding: 10,
  },
});
