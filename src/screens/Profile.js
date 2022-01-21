import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Platform } from "react-native";
import Modal from "react-native-modal";
import { GetUser, updateUser, updateEmail, updatePassword, signOut, uploadImage } from "./utils/GetDataUser";
import Toast from 'react-native-toast-message';
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
import * as ImagePicker from 'expo-image-picker';

export default function ({ navigation }) {
	const { isDarkmode, setTheme } = useTheme();

	const [user, setUser] = useState({});
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordBis, setNewPasswordBis] = useState("");

	const [isModalVisible, setModalVisible] = useState(false);
	const [isModalVisibleAdmin, setModalVisibleAdmin] = useState(false);
	const [isPasswordReset, setPasswordReset] = useState(false);

	const [selectedImage, setSelectedImage] = React.useState(null);

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
	const togglePassword = () => {
		setNewEmail("");
		setPassword("");
		setNewPassword("");
		setNewPasswordBis("");
		setModalVisibleAdmin(!isModalVisibleAdmin);
		setPasswordReset(true)
	};
	const toggleEmail = () => {
		setNewEmail("");
		setPassword("");
		setModalVisibleAdmin(!isModalVisibleAdmin);
		setPasswordReset(false)
	};

	useEffect(() => {
		getData();
	}, []);

	const setAvatar = () => {
		if (selectedImage !== null) {
			return (
				<Avatar
					source={{ uri: selectedImage.uri }}
					size="xl"
					shape="round"
				/>
			);
		} else {
			return (
				<Avatar
					source={require("../../media/avatar.png")}
					size="xl"
					shape="round"
				/>
			);
		}

		// if (selectedImage !== null) {
		// 	return (
		// 		<Image
		// 			source={{ uri: selectedImage.uri }}
		// 			style={styles.thumbnail}
		// 		/>
		// 	);
		// } else {
		// 	return (
		// 		<Image
		// 			source={require("../../media/avatar.png")}
		// 			style={styles.thumbnail}
		// 		/>
		// 	);
		// }
	};

	const getData = async () => {
		try {
			const user = await GetUser();
			setUser(user);
			setEmail(user.email);
			setName(user.Name);
		} catch (e) {
			console.log(e);
		}
	};
	const onSave = async () => {
		user.Name = name;
		const result = await updateUser(user);
		if (result) {
			getData();
			toggleModal();
			Toast.show({
				type: 'success',
				text1: 'Enregistrement réussi',
				text2: 'La modificaition a été enregistré !'
			});
		}
	};
	const onSaveAdmin = async () => {
		if (email && password) {

			if (isPasswordReset) {
				if ((newPassword && newPassword !== "") && (newPassword === newPasswordBis)) {
					const result = await updatePassword(email, password, newPassword);
					if (result) {
						setModalVisibleAdmin(false);
						Toast.show({
							type: 'success',
							text1: 'Le mot de passe a bien été modifié',
							text2: 'Votre mot de passe a été changé.'
						});
					}
				} else {
					setModalVisibleAdmin(false);
					Toast.show({
						type: 'error',
						text1: 'Mot de passe incorrect',
						text2: 'Les deux mots de passe doivent être les mêmes.'
					});
				}
			} else {
				const result = await updateEmail(email, password, newEmail);
				if (result) {
					setModalVisibleAdmin(false);
					getData();
					Toast.show({
						type: 'success',
						text1: 'L\'email a bien été modifié',
						text2: 'Votre email a été modifié.'
					});
				}
			}
		} else {
			setModalVisibleAdmin(false);
			Toast.show({
				type: 'error',
				text1: 'Saisie incorrect',
				text2: 'Vous devez remplir tous les champs.'
			});
		}
	};

	const openImagePickerAsync = async () => {
		let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}

		let pickerResult = await ImagePicker.launchImageLibraryAsync();
		if (pickerResult.cancelled) {
			return;
		}

		setSelectedImage(pickerResult);

		const filename = pickerResult.uri.substring(pickerResult.uri.lastIndexOf('/') + 1);
		const ext = filename.substring(filename.lastIndexOf('.') + 1);
		const uploadUri = Platform.OS === 'ios' ? pickerResult.uri.replace('file://', '') : pickerResult.uri;
	}

	return (
		<Layout>
			<Modal isVisible={isModalVisible}>
				<View style={[styles.modal, { backgroundColor: isDarkmode ? themeColor.black : themeColor.white100 }]}>
					<Text size="h2" fontWeight="medium" status="primary">Changer votre pseudo</Text>

					<TextInput
						containerStyle={{ marginTop: 15 }}
						placeholder="Entez votre Pseudo"
						value={name}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						onChangeText={(text) => setName(text)}
					/>

					<View style={{ flexDirection: "row" }}>
						<View style={{ flex: 0.5 }}>
							<TouchableOpacity style={[styles.modalButton, { backgroundColor: "#3366ff" }]} onPress={onSave}>
								<Ionicons
									name="save-outline"
									size={30}
									color={themeColor.white100}
									style={styles.icon}
								/>
								<Text style={{ color: themeColor.white100 }}>Enregistrer</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 0.5 }} >
							<TouchableOpacity style={[styles.modalButton, { backgroundColor: "#b6b6b6" }]} onPress={toggleModal}>
								<Ionicons
									name="close-circle-outline"
									size={30}
									color={themeColor.white100}
									style={styles.icon}
								/>
								<Text style={{ color: themeColor.white100 }}>Fermer</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
			<Modal isVisible={isModalVisibleAdmin}>
				<View style={[styles.modal, { backgroundColor: isDarkmode ? themeColor.black : themeColor.white100 }]}>
					<Text size="h2" fontWeight="medium" status="primary">Changer vos identifiants</Text>

					<TextInput
						containerStyle={{ marginTop: 15 }}
						placeholder="Entez votre Email"
						value={email}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						keyboardType="email-address"
						onChangeText={(text) => setEmail(text)}
					/>
					<TextInput
						containerStyle={{ marginTop: 15 }}
						placeholder="Entez votre Mot de passe"
						value={password}
						autoCapitalize="none"
						autoCompleteType="off"
						autoCorrect={false}
						secureTextEntry={true}
						onChangeText={(text) => setPassword(text)}
					/>
					<View style={{ display: !isPasswordReset ? "flex" : "none" }}>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Entrer la nouvelle adresse Email"
							value={newEmail}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							keyboardType="email-address"
							onChangeText={(text) => setNewEmail(text)}
						/>
					</View>
					<View style={{ display: isPasswordReset ? "flex" : "none" }}>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Entrer le nouveau mot de passe"
							value={newPassword}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							secureTextEntry={true}
							onChangeText={(text) => setNewPassword(text)}
						/>
						<TextInput
							containerStyle={{ marginTop: 15 }}
							placeholder="Confirmer le nouveau mot de passe"
							value={newPasswordBis}
							autoCapitalize="none"
							autoCompleteType="off"
							autoCorrect={false}
							secureTextEntry={true}
							onChangeText={(text) => setNewPasswordBis(text)}
						/>
					</View>

					<View style={{ flexDirection: "row" }}>
						<View style={{ flex: 0.5 }}>
							<TouchableOpacity style={[styles.modalButton, { backgroundColor: "#3366ff" }]} onPress={onSaveAdmin}>
								<Ionicons
									name="save-outline"
									size={30}
									color={themeColor.white100}
									style={styles.icon}
								/>
								<Text style={{ color: themeColor.white100 }}>Enregistrer</Text>
							</TouchableOpacity>
						</View>
						<View style={{ flex: 0.5 }} >
							<TouchableOpacity style={[styles.modalButton, { backgroundColor: "#b6b6b6" }]} onPress={toggleEmail}>
								<Ionicons
									name="close-circle-outline"
									size={30}
									color={themeColor.white100}
									style={styles.icon}
								/>
								<Text style={{ color: themeColor.white100 }}>Fermer</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<View style={styles.view}>
				<View style={styles.topContainer}>
					<Section style={styles.card}>
						<SectionContent>
							{/* <Avatar
								source={require("../../media/avatar.png")}
								size="xl"
								shape="round"
							/> */}
							{setAvatar()}
							<Text style={{ margin: 5 }}>{String(user.Name)}</Text>
						</SectionContent>
					</Section>
				</View>
				<View style={{ flex: 0.2 }}>

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

					<TouchableOpacity style={styles.button} onPress={toggleModal}>
						<Ionicons
							name="document-text-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon pseudo</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={openImagePickerAsyncBis}>
						<Ionicons
							name="person-circle-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon avatar</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={toggleEmail}>
						<Ionicons
							name="mail-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon email</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={togglePassword}>
						<Ionicons
							name="lock-closed-outline"
							size={30}
							color={isDarkmode ? themeColor.white100 : themeColor.black}
							style={styles.icon}
						/>
						<Text>Modifier mon mot de passe</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.button} onPress={signOut}>
						<Ionicons
							name="log-out-outline"
							size={30}
							color="#d75724"
							style={styles.icon}
						/>
						<Text style={{ color: "#d75724" }}>Déconnexion</Text>
					</TouchableOpacity>

					<TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
						<Text>Pick a photo</Text>
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
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.44,
		shadowRadius: 10.32,
		elevation: 16
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
		marginRight: 10
	},
	view: {
		flex: 1
	},
	modal: {
		padding: 15,
		borderRadius: 10
	},
	modalButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: "flex-start",
		padding: 10,
		marginLeft: 5,
		marginRight: 5,
		marginTop: 15,
		borderRadius: 10
	},
	thumbnail: {
		width: 100,
		height: 100,
		resizeMode: "contain"
	}
});
