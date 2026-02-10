import InputRFH from '@/components/common/inputs/InputRFH';
import { getNestedError } from '@/utils/helpers/getNestedError';

export default function ProfileImageField({
    control,
    register,
    errors,
    viewMode,
    profileImagePreview,
    onImageChange,
    required
}) {
    return (
        <div className="space-y-2">
            <InputRFH
                p="px-3 py-3"
                control={control}
                register={register}
                error={getNestedError(errors, 'profile_picture')}
                type="file"
                placeholder="validation.profile_picture.placeholder"
                disabled={viewMode}
                label="validation.profile_picture.label"
                name="profile_picture"
                accept="image/*"
                required={required}
                onChange={onImageChange}
            />
            {profileImagePreview && (
                <div className="mt-2">
                    <img
                        src={profileImagePreview}
                        alt="Profile Preview"
                        className="h-32 w-32 object-cover rounded-full border-2 border-gray-300"
                    />
                </div>
            )}
        </div>
    );
}

