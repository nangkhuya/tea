import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingState } from './components/ui/FeedbackStates';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LobbyPage = lazy(() => import('./pages/LobbyPage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AvatarEntryPage = lazy(() => import('./pages/AvatarEntryPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TeaSpaceBoundaryPage = lazy(() => import('./pages/TeaSpaceBoundaryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <LoadingState />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/avatar" element={<AvatarEntryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/tea-space/:roomId" element={<TeaSpaceBoundaryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AppLayout>
    </BrowserRouter>
  );
}
