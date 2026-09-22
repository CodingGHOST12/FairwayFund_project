'use client';

import { useState } from 'react';
import { Winner, WinnerProof } from '@/types';
import { winnerService } from '@/lib/services/winner.service';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/draw/prize-pool';

type ProofUploadProps = {
  winner: Winner;
  onSuccess?: () => void;
};

export function ProofUpload({ winner, onSuccess }: ProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await winnerService.submitProof(winner.userId, winner.id, file);
      if (result.success) {
        setSuccess(true);
        setFile(null);
        setPreview(null);
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to upload proof');
      }
    } catch (err) {
      setError('An error occurred while uploading proof');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (winner.verificationStatus !== 'pending' || winner.proofSubmittedAt) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Proof of Score</h3>
        <p className="text-sm text-gray-600">
          Upload a screenshot or photo of your golf scorecard showing your {winner.matchType} winning scores.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          ✓ Proof submitted successfully. We'll review it shortly.
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">Preview</p>
          <img
            src={preview}
            alt="Proof preview"
            className="max-w-full max-h-64 rounded-lg border border-gray-300"
          />
        </div>
      )}

      {!success && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p className="text-xs text-gray-500 mt-1">Max 5MB • PNG, JPEG, GIF, or WebP</p>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <p className="font-semibold text-gray-900">{file.name}</p>
                <p className="text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!file || isSubmitting}
              className="flex-1"
            >
              Submit Proof
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
