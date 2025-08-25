import { insertThreads } from '@/shared/api/thread';
import Button from '@/shared/components/button/Button';
import Input from '@/shared/components/Input';
import InputModal from '@/shared/components/modals/InputModal';
import Textarea from '@/shared/components/textarea/Textarea';
import { useRef, useState } from 'react';
import { toastUtils } from '@/shared/utils/toastUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function CreateThreads({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  // 임시 userId
  const userId = '814fcdb8-c777-4c4f-a74a-c2a8987f0b83';

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [titleError, setTitleError] = useState(false);

  const handleCreateInfo = async () => {
    const title = titleRef.current?.value ?? '';
    const description = descriptionRef.current?.value ?? '';
    const password = passwordRef.current?.value ?? '';

    const id = crypto.randomUUID();
    const domain = window.location.origin;
    const link = `${domain}/threads/${id}`;

    if (!title) {
      setTitleError(true);
      toastUtils.error('제목을 입력해 주세요.');
      return;
    }
    setTitleError(false);

    await insertThreads({
      id: id,
      owner_id: userId,
      title,
      description,
      password,
      link,
      isPrivate: !!password,
    });

    toastUtils.success('방만들기 성공😊');
    onClose();
  };

  return (
    <InputModal title="방 만들기" content="" onClose={onClose}>
      {/* children */}
      <div className="flex flex-col gap-5">
        <Input
          label="제목"
          placeholder="20자 내외로 입력해 주세요."
          maxLength={20}
          showLabel
          tabIndex={0}
          ref={titleRef}
          autoFocus
          className={titleError ? 'border-red-400' : ''}
          onChange={(e) => {
            if (e.target.value.trim()) {
              setTitleError(false);
            } else {
              setTitleError(true);
            }
          }}
        />
        <Textarea
          label="설명(선택)"
          placeholder="100자 내외로 입력해 주세요."
          maxLength={100}
          ref={descriptionRef}
          showLabel
        />
        <Input.Password
          label="비밀번호(선택)"
          placeholder="10자 내외로 입력해 주세요."
          maxLength={10}
          ref={passwordRef}
          showLabel
        />
        <Button
          size="default"
          color="default"
          onClick={handleCreateInfo}
          fullWidth
        >
          만들기
        </Button>
      </div>
    </InputModal>
  );
}
export default CreateThreads;
