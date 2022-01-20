import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GetUser } from "./utils/GetDataUser";
import {
	Layout,
	Text,
	TextInput,
	Button,
	Avatar,
	useTheme,
} from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ({ navigation }) {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const { isDarkmode, setTheme } = useTheme();

	const getData = async () => {
		try {
			const uid = await AsyncStorage.getItem("uid");
			const user = await GetUser();
		} catch (e) {
			// error reading value
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Layout>
			<View style={styles.container}>
				<Avatar
					source={require("../../media/avatar.png")}
					size="xl"
					shape="round"
				/>
				<Text style={styles.button}>{String(name)}</Text>

				<TextInput
					containerStyle={{ marginTop: 15 }}
					placeholder="mail"
					value={email}
					autoCapitalize="none"
					autoCompleteType="off"
					autoCorrect={false}
					keyboardType="email-address"
					onChangeText={(text) => setEmail(text)}
				/>
				<TextInput
					containerStyle={{ marginTop: 15 }}
					placeholder="identifiant"
					value={name}
					autoCapitalize="none"
					autoCompleteType="off"
					autoCorrect={false}
					onChangeText={(text) => setName(text)}
				/>

				<Button
					text="Modifier mon mot de passe"
					onPress={() => {
						getData();
					}}
					style={styles.button}
				/>
				<Button
					text="Modifier mon Avatar"
					onPress={() => {
						//
					}}
					style={styles.button}
				/>
				<Button
					text="Modifier mes informations"
					onPress={() => {
						//
					}}
					style={styles.button}
				/>
				<Button
					status="danger"
					text="Déconnexion"
					onPress={() => {
						firebase.auth().signOut();
					}}
					style={styles.button}
				/>
				<Button
					text={isDarkmode ? "Light Mode" : "Dark Mode"}
					status={isDarkmode ? "success" : "warning"}
					onPress={() => {
						if (isDarkmode) {
							setTheme("light");
						} else {
							setTheme("dark");
						}
					}}
					style={{
						marginTop: 10,
					}}
				/>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		marginTop: 10,
	},
});
