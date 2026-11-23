import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function NotFoundPage() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <Card surface="paper" className="text-center py-12">
        <p className="font-serif text-sm text-moss dark:text-sage">404</p>
        <h1 className="mt-2 font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
          {language === 'vi' ? 'Không Tìm Thấy Đường Dẫn Này' : 'Page Not Found'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-walnut dark:text-ink-muted">
          {language === 'vi'
            ? 'Đường dẫn bạn vừa truy cập không nằm trong trà thất. Mời bạn quay lại trang chủ hoặc sảnh trà.'
            : 'The requested path is outside the tea house sanctuary. Please return home or visit the lobby.'}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => navigate('/lobby')}>
            {t.common.backLobby}
          </Button>
          <Button onClick={() => navigate('/')}>{t.common.backHome}</Button>
        </div>
      </Card>
    </div>
  );
}
