import React, {Component} from 'react'
import { connect } from 'react-redux'
import { login } from '../store/actions/user'
import {    
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native'
import icon from '../../assets/imgs/login.png'

class Login extends Component {
    state = {
        name: 'Temporario',
        email: '',
        password: ''
    }
    componentDidUpdate = prevProps => {
        if (prevProps.isLoading && !this.props.isLoading) {
            this.props.navigation.navigate('Profile')
        }
    }

    login = () => {
        this.props.onLogin({ ...this.state })
    }
    render() {
        return(
            <View style={styles.container}>
                <Image source={icon} style={styles.image} />
                <TextInput placeholder='Email' style={styles.input}
                    autoFocus={true} keyboardType='email-address'
                    value={this.state.email}
                    onChangeText={email => this.setState({email})} />
                <TextInput placeholder='Senha' style={styles.input}
                    secureTextEntry={true} value={this.state.password}
                    onChangeText={password => this.setState({password})} />
                <TouchableOpacity onPress={this.login} style={styles.buttomLogin}>
                    <Text style={styles.buttomTextLogin}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.navigate('Register')
                    }} style={styles.buttomRegister}>
                    <Text>Não possui uma conta ainda?</Text>
                    <Text style={styles.buttomTextRegister}> Criar conta</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    buttomLogin: {
        marginTop: 30,
        padding: 10,
        backgroundColor: '#4286f4',
        marginRight: 5,
    },
    buttomTextLogin: {
        fontSize: 25,
        color: '#FFF',
        paddingLeft: 15,
        paddingRight: 15,
        
    },
    buttomRegister: {
        marginTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    buttomTextRegister: {
        fontSize: 15,
        color: '#000',
        
    },
    input: {
        marginTop: 20,
        width: '90%',
        backgroundColor: '#EEE',
        height: 40,
        borderWidth: 1,
        borderColor: '#333',
        paddingLeft: 15
    },
    image:{
        height: 120,
        width: 120,
        resizeMode: 'contain',
        backgroundColor: '#fff'
    },
})

const mapStateToProps = ({ user }) => {
    return {
        isLoading: user.isLoading
    }
}

const mapDispatchToProps = dispatch  => {
    return {
        onLogin: user => dispatch(login(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)