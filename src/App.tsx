import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from './stores/authStore';
import BottomNav from './components/common/BottomNav';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import CreateActivityPage from './pages/CreateActivityPage';
import WallPage from './pages/WallPage';
import CreatePostPage from './pages/CreatePostPage';
import MapPage from './pages/MapPage';
import ProfilePage from './pages/ProfilePage';
import InterestManagePage from './pages/InterestManagePage';
import MessagesPage from './pages/MessagesPage';
import ChatPage from './pages/ChatPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="max-w-md mx-auto">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/activities/create" element={<CreateActivityPage />} />
                    <Route path="/activities/:id" element={<ActivityDetailPage />} />
                    <Route path="/wall" element={<WallPage />} />
                    <Route path="/wall/post" element={<CreatePostPage />} />
                    <Route path="/wall/:id" element={<WallPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/edit" element={<ProfilePage />} />
                    <Route path="/profile/interests" element={<InterestManagePage />} />
                    <Route path="/profile/settings" element={<ProfilePage />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/messages/:userId" element={<ChatPage />} />
                  </Routes>
                  <BottomNav />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
