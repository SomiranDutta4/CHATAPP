import React, { useEffect, useContext } from 'react'
import { AppContext } from '../Context/ContextProvider'

const Socket = () => {
  const { User, clickedChat, socket, LoadedChats, AllChats, setAlert,
    NewMEssageHandler, setLoadedChats, setClicked, setChats } = useContext(AppContext)


  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on("message recieved", (newMessage) => {
      if (clickedChat && clickedChat._id === newMessage.chat) {
        NewMEssageHandler(newMessage, false);
        setAlert(null);
      } else {
        setAlert(['message', `${newMessage.sender.name}: ${newMessage.content}`])
        setTimeout(() => {
          setAlert(null)
        }, 1800)
      }
    })
  })

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('added member', async (groupDetails) => {
      let newChats = AllChats
      let newChatUrl = `http:localhost:2000/chat/new/fetchNew/?token=${User.token}&_id=${groupDetails.chatId}`
      let response = await fetch(newChatUrl)
      let data = await response.json()
      newChats.unshift(data.chat)
      setChats(newChats)
    })
  })
  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('removed member', groupDetails => {
      let newChats = AllChats
      newChats = newChats.filter(chat => chat._id !== groupDetails.chatId)
      setChats(newChats)
    })
  })

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('added admin', groupDetails => {
      let newLoadedChats = LoadedChats
      newLoadedChats.forEach(chat => {
        if (chat._id === groupDetails.chatId) {
          chat.groupAdmins.push(User)
          if (clickedChat._id === chat._id) {
            setClicked(chat)
          }
        }
      })
      setLoadedChats(newLoadedChats)
    })
  })

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('removed admin', groupDetails => {
      let newLoadedChats = LoadedChats
      newLoadedChats.forEach(chat => {
        if (chat._id === groupDetails.chatId) {
          let newAdmins = chat.groupAdmins.filter(user => user._id !== User._id)
          chat.groupAdmins = newAdmins
          if (clickedChat._id === chat._id) {
            setClicked(chat)
          }
        }
      })
      setLoadedChats(newLoadedChats)
    })
  })


  return (
    <div></div>
  )
}

export default Socket
