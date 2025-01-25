import './App.css'
import { ChatLayout } from './components/layout/ChatLayout';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './components/login/LoginPage';
import { RecordLayout } from './components/layout/RecordLayout';

function App() {
  return (
    <div className="App">
      {/* <MainLayout /> */}
      {/* <ChatLayout /> */}
      {/* <LoginPage /> */}
      <RecordLayout />
    </div>
  );
}

export default App;
