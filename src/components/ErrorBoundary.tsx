import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Error captured cleanly without exposing internal stack traces in UI
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
          <Card surface="paper" className="text-center py-10">
            <h1 className="font-serif text-2xl font-medium text-dark-walnut dark:text-ink-text">
              Đã xảy ra gián đoạn ngoài ý muốn
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-walnut dark:text-ink-muted">
              Không gian trà tạm thời gặp sự cố hiển thị. Mời bạn tải lại trang hoặc quay về trang chủ.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.assign('/');
                }}
              >
                Về Trang chủ
              </Button>
              <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
