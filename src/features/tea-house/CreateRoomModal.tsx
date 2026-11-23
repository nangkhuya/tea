import { useState, type FormEvent } from 'react';
import { ENVIRONMENT_OPTIONS, MAX_ROOM_CAPACITY } from '../../config/constants';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../stores/useAppStore';
import { useProfileStore } from '../../stores/useProfileStore';
import { useRoomStore } from '../../stores/useRoomStore';
import type { CreateRoomInput, TeaRoom } from '../../types/domain';
import { validateCreateRoomInput } from '../../utils/validation';
import { Button } from '../../components/ui/Button';
import { SelectField, TextArea, TextField } from '../../components/ui/FormControls';
import { Modal } from '../../components/ui/Modal';

interface CreateRoomModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (room: TeaRoom) => void;
}

const INITIAL_FORM: CreateRoomInput = {
  name: '',
  description: '',
  capacity: 10,
  visibility: 'public',
  environmentId: 'bamboo-courtyard',
  teaTradition: 'Ô Long & Bạch Trà',
};

export function CreateRoomModal({ open, onClose, onCreated }: CreateRoomModalProps) {
  const { language } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const createDemoRoom = useRoomStore((s) => s.createDemoRoom);
  const pushNotification = useAppStore((s) => s.pushNotification);

  const [form, setForm] = useState<CreateRoomInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validation = validateCreateRoomInput(form, language);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    const created = await createDemoRoom(form, profile.displayName);
    setSubmitting(false);

    if (created) {
      pushNotification({
        tone: 'success',
        title: language === 'vi' ? 'Đã tạo phòng trà mẫu' : 'Demo tea room created',
        description: created.name,
      });
      setForm(INITIAL_FORM);
      setErrors({});
      onClose();
      onCreated?.(created);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={language === 'vi' ? 'Khởi Tạo Phòng Trà Mẫu' : 'Create Demo Tea Room'}
      description={
        language === 'vi'
          ? `Phòng tạo ở Giai đoạn 01 được lưu cục bộ trong Chế độ Demo (tối đa ${MAX_ROOM_CAPACITY} người).`
          : `Rooms created in Phase 01 are stored locally in Demo Mode (max ${MAX_ROOM_CAPACITY} guests).`
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          label={language === 'vi' ? 'Tên phòng trà' : 'Room name'}
          value={form.name}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, name: e.target.value }));
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder={language === 'vi' ? 'Ví dụ: Tĩnh Tâm Trà Hiên' : 'e.g., Quiet Bamboo Pavilion'}
          error={errors.name}
          required
        />

        <TextArea
          label={language === 'vi' ? 'Mô tả không gian' : 'Description'}
          value={form.description}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, description: e.target.value }));
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder={
            language === 'vi'
              ? 'Chia sẻ bầu không khí, chủ đề tọa đàm hoặc nhịp điệu buổi trà...'
              : 'Describe the atmosphere and tea gathering intention...'
          }
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            label={language === 'vi' ? 'Kiến trúc không gian' : 'Environment'}
            value={form.environmentId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                environmentId: e.target.value as TeaRoom['environmentId'],
              }))
            }
          >
            {ENVIRONMENT_OPTIONS.map((env) => (
              <option key={env.id} value={env.id}>
                {language === 'vi' ? env.labelVi : env.labelEn}
              </option>
            ))}
          </SelectField>

          <SelectField
            label={language === 'vi' ? 'Quyền riêng tư' : 'Visibility'}
            value={form.visibility}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                visibility: e.target.value as TeaRoom['visibility'],
              }))
            }
          >
            <option value="public">{language === 'vi' ? 'Công khai' : 'Public'}</option>
            <option value="private">{language === 'vi' ? 'Riêng tư' : 'Private'}</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label={language === 'vi' ? 'Số chỗ tối đa (2–12)' : 'Max capacity (2–12)'}
            type="number"
            min={2}
            max={MAX_ROOM_CAPACITY}
            value={form.capacity}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }));
              setErrors((prev) => ({ ...prev, capacity: undefined }));
            }}
            error={errors.capacity}
          />

          <TextField
            label={language === 'vi' ? 'Dòng trà chủ đạo' : 'Tea tradition'}
            value={form.teaTradition}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, teaTradition: e.target.value }));
              setErrors((prev) => ({ ...prev, teaTradition: undefined }));
            }}
            error={errors.teaTradition}
          />
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-3">
          <Button variant="ghost" onClick={onClose}>
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? language === 'vi'
                ? 'Đang khởi tạo...'
                : 'Creating...'
              : language === 'vi'
                ? 'Tạo phòng mẫu'
                : 'Create demo room'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
