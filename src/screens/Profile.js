import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import { GetUser } from "./utils/GetDataUser";
import {
	Layout,
	Text,
	TextInput,
	Button,
	Avatar,
	Section,
	SectionContent,
	themeColor,
	useTheme,
} from "react-native-rapi-ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { color } from "react-native-reanimated";

export default function ({ navigation }) {

	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const { isDarkmode, setTheme } = useTheme();
	const onPress = () => console.log('Pressed');

	useEffect(() => {
		getData()
	}, []);

	const getData = async () => {
		try {
			const uid = await AsyncStorage.getItem("uid");
			const user = await GetUser();
			setEmail(user.email);
			setName(user.Name);
		} catch (e) {
			// error reading value
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<Layout>
			<View style={styles.view}>
				<View style={styles.topContainer}>
					<Section style={styles.card}>
						<SectionContent>
							<Avatar
								source={require("../../media/avatar.png")}
								size="xl"
								shape="round"
							/>
							<Text style={{ margin: 5 }}>{String(name)}</Text>
						</SectionContent>
					</Section>
				</View>
				<View style={{flex: 0.2}}>

				</View>
				<View style={styles.view}>
					<TouchableOpacity style={styles.button}
						onPress={() => {
							isDarkmode ? setTheme("light") : setTheme("dark");
						}}
					>
						<Ionicons
							name={isDarkmode ? "sunny-outline" : "moon-outline"}
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>
							{isDarkmode ? "Mode Clair" : "Mode Sombre"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={onPress}>
						<Ionicons
							name="document-text-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon pseudo</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={onPress}>
						<Ionicons
							name="person-circle-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon avatar</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={onPress}>
						<Ionicons
							name="mail-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon email</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={onPress}>
						<Ionicons
							name="lock-closed-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon mot de passe</Text>
					</TouchableOpacity>

					<TouchableOpacity style={[styles.button]} onPress={() => {
						firebase.auth().signOut();
					}}>
						<Ionicons
							name="log-out-outline"
							size={30}
							color="#d75724"
							style={styles.icon}
						/>
						<Text style={{ color: "#d75724" }}>Déconnexion</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Layout>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: 'center',
		margin: 20,
	},
	topContainer: {
		flex: 0.2,
		backgroundColor: '#3366ff',
	},
	button: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: "flex-start",
		padding: 10,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 5,
		borderRadius: 10
	},
	icon: {
		marginRight: 20
	},
	view: {
		flex: 1
	}
});
