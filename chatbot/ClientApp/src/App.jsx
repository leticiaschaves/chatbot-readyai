import './App.css'
import { Provider } from 'react-redux/es'
import store from './redux/store'
import Chatbot from './components/Chatbot'

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
