import React from 'react';
import { View , Alert} from 'react-native';
import { Layout, Text , Avatar ,Section, SectionContent, Button} from 'react-native-rapi-ui';
import firebase from "firebase";
import {GetNameUser} from '../screens/utils/GetDataUser'
import { render } from 'react-dom';
 
export default function ({ navigation }) {
	const userName = GetNameUser()
	console.log(userName)

		return (
			<Layout>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						marginTop: 20,
					}}>
						<Avatar
							source={require('../../media/avatar.png')}
							size="xl"
							shape="round"
						/>
						<Text 
							style={{marginTop: 10}}>
							{String(userName.userName)}
						</Text>
	
						<Button
							text="Modifier mon mot de passe"
							onPress={() => {
								//
							}}
							style={{
								marginTop: 100,
								
							}}
						/>
						<Button
							text="Modifier mon Avatar"
							onPress={() => {
								//
							}}
							style={{
								marginTop: 10,
								
							}}
						/>
						<Button
							text="Modifier mon nom"
							onPress={() => {
								//
							}}
							style={{
								marginTop: 10,
							}}
						/>
						<Button
							status="danger"
							text="Déconnexion"
							onPress={() => {
								firebase.auth().signOut();
							}}
							style={{
								marginTop: 10,
	
							}}
						/>
				</View>
			</Layout>
		);
}


