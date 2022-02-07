import { WebView } from 'react-native-webview';


export default function SongDetail({route}){
	const { external_url } = route.params; 
	return(
		<WebView source={{ uri: external_url }}/>
	);
}
