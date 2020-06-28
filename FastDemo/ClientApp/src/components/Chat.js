import React, { Component } from 'react';
import * as SignalR from '@aspnet/signalr';

export class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            message: '',
            messages: [],
            hubConnection: null,
        }
    }
    sendMessage = () => {
        this.state.hubConnection
            .invoke('sendToAll', this.state.nick, this.state.message)
            .catch(err => console.error(err));
        this.setState({ message: '' });
    }
    componentDidMount = () => {
        const nick = window.prompt('Your name:', 'John');

        const hubConnection = new SignalR.HubConnectionBuilder().withUrl("/chatHub").build();

        this.setState({ hubConnection, nick }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));

            this.state.hubConnection.on('ReceiveMessage', (nick, recievedMessage) => {
                console.log(nick, recievedMessage);
                const text = `${nick}: ${recievedMessage}`;
                const messages = this.state.messages.concat([text]);
                this.setState({ messages: messages });
            })
        })

    }
    render() {
        return (
            <div>
                <br />
                <input type="text"
                    value={this.state.message}
                    onChange={e => this.setState({ message: e.target.value })}
                />

                <button onClick={this.sendMessage}>Send</button>
                <div>
                    {this.state.messages.map((message, index) => (
                        <span style={{ display: 'block' }} key={index}>{message}</span>
                        ))}
                    </div>
            </div>
            )
    }
}