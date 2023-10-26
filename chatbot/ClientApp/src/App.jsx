import './App.css'
import { Chatbot } from './components/Chatbot'
import { Provider } from 'react-redux/es'
import store from './redux/store'

function App() {
  return (
    <Provider store={store}>
      <>
        <Chatbot />
      </>
    </Provider>
  )
}

export default App
