import { WebView } from 'react-native-webview';

export default function SongPreview({ route }){
	const { preview_url } = route.params; 

	return(
		<WebView source={{ uri: preview_url }}/>
	);
}
