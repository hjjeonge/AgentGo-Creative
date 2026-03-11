import { useEffect, useMemo, useState } from 'react';
import type { TemplateField } from '../../types/template';

type FormValues = Record<string, string | string[]>;
type FormFiles = Record<string, File[]>;

const buildInitialValues = (fields: TemplateField[]): FormValues => {
  return fields.reduce<FormValues>((acc, field) => {
    acc[field.key] = field.type === 'tags' ? [] : '';
    return acc;
  }, {});
};

export const useTemplateForm = (fields: TemplateField[]) => {
  const [values, setValues] = useState<FormValues>({});
  const [files, setFiles] = useState<FormFiles>({});
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(buildInitialValues(fields));
    setFiles({});
    setTagInput({});
  }, [fields]);

  const getStringValue = (key: string): string => {
    const value = values[key];
    return typeof value === 'string' ? value : '';
  };

  const getTagsValue = (key: string): string[] => {
    const value = values[key];
    return Array.isArray(value) ? value : [];
  };

  const setStringValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setTagInputValue = (key: string, value: string) => {
    setTagInput((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = (field: TemplateField, raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const maxItems = field.maxItems ?? 5;
    const current = getTagsValue(field.key);
    if (current.includes(trimmed) || current.length >= maxItems) return;

    setValues((prev) => ({
      ...prev,
      [field.key]: [...current, trimmed],
    }));
    setTagInput((prev) => ({ ...prev, [field.key]: '' }));
  };

  const removeTag = (fieldKey: string, tag: string) => {
    const current = getTagsValue(fieldKey);
    setValues((prev) => ({
      ...prev,
      [fieldKey]: current.filter((item) => item !== tag),
    }));
  };

  const handleSingleFile = (fieldKey: string, selected: File | null) => {
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: selected ? [selected] : [],
    }));
  };

  const handleMultiFiles = (fieldKey: string, selected: File[]) => {
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: selected,
    }));
  };

  const removeFile = (fieldKey: string, index: number) => {
    const current = files[fieldKey] ?? [];
    setFiles((prev) => ({
      ...prev,
      [fieldKey]: current.filter((_, idx) => idx !== index),
    }));
  };

  const isFieldFilled = (field: TemplateField): boolean => {
    if (!field.required) return true;

    if (field.type === 'file' || field.type === 'files') {
      return (files[field.key]?.length ?? 0) > 0;
    }

    if (field.type === 'tags') {
      return getTagsValue(field.key).length > 0;
    }

    return getStringValue(field.key).trim().length > 0;
  };

  const canGenerate = useMemo(
    () => fields.every((field) => isFieldFilled(field)),
    [fields, values, files],
  );

  return {
    values,
    files,
    tagInput,
    getStringValue,
    getTagsValue,
    setStringValue,
    setTagInputValue,
    addTag,
    removeTag,
    handleSingleFile,
    handleMultiFiles,
    removeFile,
    isFieldFilled,
    canGenerate,
  };
};
