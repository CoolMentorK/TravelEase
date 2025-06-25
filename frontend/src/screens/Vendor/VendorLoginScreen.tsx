import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import getEnvVars from "../../../config.tsx";

const { API_BASE_URL } = getEnvVars();

const VendorLoginScreen = () => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/vendor/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()

            if (!res.ok) {
                Alert.alert('Login Failed', data.message || 'Check credentials')
                return
            }

            // ✅ Optional: Store token in async storage or context for reuse
            // await AsyncStorage.setItem('vendorToken', data.token)

            Alert.alert('Welcome', `Logged in as ${data.vendor.name}`)
            navigation.navigate('VendorDashboard') // 👈 redirect to dashboard
        } catch (err) {
            Alert.alert('Error', 'Network request failed')
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vendor Login</Text>

            <View style={styles.inputContainer}>
                <Icon name="mail" size={20} color="#005F8D" style={styles.icon} />
                <TextInput
                    placeholder="Email"
                    style={styles.input}
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    value={email}
                />
            </View>

            <View style={styles.inputContainer}>
                <Icon name="lock" size={20} color="#005F8D" style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
                <LinearGradient
                    colors={['#F2994A', '#F2C94C']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    )
}

export default VendorLoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#005F8D',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#D1D1D1',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 12,
        backgroundColor: '#F9F9F9',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    buttonWrapper: {
        marginTop: 12,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#121212',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkText: {
        color: '#4FB993',
        textAlign: 'center',
        marginTop: 12,
    },
})
