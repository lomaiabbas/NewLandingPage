'use client';

import { App, Button,Spin,Tooltip } from 'antd';
import { CSSProperties, useRef } from 'react'
import { CloudUpload, FileQuestion, Loader2 } from 'lucide-react';
import { getClientTranslation } from '@/app/i18n/client';
import styles from './file-uploader.module.css';

interface FileUploaderProps {
    buttonMode?: boolean;
    darkIcon?: boolean;
    title?: any;
    id?: string;
    classes?: string;
    style?: CSSProperties;
    ImageOnly?: boolean;
    singleFile?: boolean;
    PDFOnly?: boolean;
    loading?: boolean;
    icon?: any;
    OnOK?: any;
    handleChange?: any;
    extra?: string;
    uploading?: boolean;
    onlyPNGJPJ?: boolean;
    lng: string;
    VideoOnly?: boolean;
}
  
const FileUploader = (props: FileUploaderProps) => {
    const { buttonMode, uploading, extra, handleChange, id, classes, icon, style, loading, singleFile, PDFOnly, ImageOnly, OnOK, onlyPNGJPJ, lng, VideoOnly } = props;
    const inputRef = useRef<any>();
    const { t } = getClientTranslation(lng);
    // const { maxFileSize } = useGlobalState();
    const maxFileSize = 5;
    const { message } = App.useApp();


    const checkSingleFile = (files: any) => {
        let file = files[0];
        if (file.size <= maxFileSize * 1024 * 1024) {
            if (PDFOnly && file.type !== 'application/pdf' && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                message.error(t('SelectPDF'), 5);
            } else if (onlyPNGJPJ && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') {
                message.error(t('SelectImage'), 5);
            } else if (ImageOnly && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== "image/webp") {
                message.error(t('SelectImage'), 5);
            } else if (VideoOnly && file.type !== 'video/mp4') {
                message.error(t('SelectVideo'), 5);
            } else if (!VideoOnly && !PDFOnly && !ImageOnly && file.type !== 'video/mp4' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== "image/webp" && file.type !== 'image/jpeg' && file.type !== 'application/pdf') {
                message.error(t('SelectFile'), 5);
            }
            if (
                (VideoOnly && file.type === 'video/mp4') ||
                (PDFOnly && (file.type === 'application/pdf' || file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) ||
                (ImageOnly && (file.type === 'image/png' || file.type === "image/webp" || file.type === 'image/jpg' || file.type === 'image/jpeg')) ||
                (!PDFOnly && !ImageOnly && (file.type === 'image/png' || file.type === "image/webp" || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'application/pdf' || file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                return true;
            }
            return false;
        } else {
            message.error(t('ExceedMaxFileSize'), 5);
            return false;
        }
    };

    const checkMultiFile = (files: any) => {
        let filesResult = [];
        let error = false;
        let tempFiles = [];
        for (let file of files) {
            if (file.size <= maxFileSize * 1024 * 1024)
                tempFiles.push(file);
            else {
                message.error(t('ExceedMaxFileSize'), 5);
            }
        }
        if (PDFOnly) {
            for (let file of tempFiles) {
                if (file.type === 'application/pdf' || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                    filesResult.push(file);
                else {
                    error = true;
                }
            }
            if (error)
                message.error(t('SelectPDFs'), 5);
        } else if (onlyPNGJPJ) {
            for (let file of tempFiles) {
                if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')
                    filesResult.push(file);
                else {
                    error = true;
                }
            }
            if (error)
                message.error(t('SelectImages'), 5);
        }
        else if (ImageOnly) {
            for (let file of tempFiles) {
                if (file.type === 'image/png' || file.type === "image/webp" || file.type === 'image/jpg' || file.type === 'image/jpeg')
                    filesResult.push(file);
                else {
                    error = true;
                }
            }
            if (error)
                message.error(t('SelectImages'), 5);
        } else if (VideoOnly) {
            for (let file of tempFiles) {
                if (file.type === 'video/mp4')
                    filesResult.push(file);
                else {
                    error = true;
                }
            }
            if (error)
                message.error(t('SelectVideos'), 5);
        } else if (!ImageOnly && !PDFOnly) {
            for (let file of tempFiles) {
                if (file.type === 'application/pdf' || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === 'image/png' || file.type === "image/webp" || file.type === 'image/jpg' || file.type === 'image/jpeg')
                    filesResult.push(file);
                else {
                    error = true;
                }
            }
            if (error)
                message.error(t('SelectFiles'), 5);
        }
        return filesResult;
    };
   

    const handleDrop = (event: any) => {
        event.preventDefault();
        let dropzone = document.querySelector(`.dropzone#${id}`);
        if (dropzone)
            dropzone.classList.remove(styles.highlight);
        
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            if (singleFile && checkSingleFile(event.dataTransfer.files))
                OnOK(event.dataTransfer.files);
            else if (!singleFile) {
                let files = checkMultiFile(event.dataTransfer.files);
                if (files.length > 0)
                    OnOK(files);
            }
        }
    };

    const handleDragOver = (event: any) => {
        event.preventDefault();
        let dropzone = document.querySelector(`.dropzone#${id}`);
        if (dropzone)
            dropzone.classList.add(styles.highlight);
    };

    const handleDragLeave = (event: any) => {
        event.preventDefault();
        let dropzone = document.querySelector(`.dropzone#${id}`);
        if (dropzone)
            dropzone.classList.remove(styles.highlight);
    };

    const handleDragEnter = (event: any) => {
        event.preventDefault();
        let dropzone = document.querySelector(`.dropzone#${id}`);
        if (dropzone)
            dropzone.classList.add(styles.highlight);
    };
    

    return (
        <>
            {buttonMode ? (
                <>
                    <Tooltip title={<div>
                        <p style={{ fontSize: '12px', marginTop: '8px' }}>{VideoOnly? `${t("AcceptedFormats")}: MP4` : PDFOnly ? `${t("AcceptedFormats")}: PDF, docx` : onlyPNGJPJ ? `${t("AcceptedFormats")}: PNG, JPG, JPEG` : ImageOnly ? `${t("AcceptedFormats")}: PNG, JPG, JPEG, WebP` : `${t("AcceptedFormats")}: PNG, JPG, JPEG, WebP, PDF, docx`}</p>
                        {extra && <p style={{ marginBottom: '8px', fontSize: '12px' }}>{extra}</p>}
                    </div>}>
                        <FileQuestion style={{ cursor: 'pointer', userSelect: 'none' }} />
                    </Tooltip>
                    <label
                        htmlFor={id}
                        className={classes ? loading ? `${classes} disabled ant-btn-primary warning flex items-center justify-center` :
                            `${classes} ant-btn-primary warning flex items-center justify-center` :
                            loading ? "disabled ant-btn-primary warning flex items-center justify-center" : "ant-btn-primary warning flex items-center justify-center"}
                        style={style ? style : { width: '30px', height: '30px', display: 'flex', justifyContent: 'center' }}
                    >

                        <input
                            accept={VideoOnly? 'video/mp4' : PDFOnly ? 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : onlyPNGJPJ ? 'image/png,image/jpeg' : ImageOnly ? 'image/png,image/jpeg,image/webp' : 'image/png,image/jpeg,application/pdf,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                            id={id}
                            onChange={(e) => {
                                e.preventDefault();
                                if (checkSingleFile(e.target.files))
                                    handleChange(e.target.files?.[0]);
                            }}
                            type='file'
                            style={{ display: 'none' }}
                        />
                        {loading ?
                            <Loader2 className="animate-spin2" color="#fff" size={20} />
                            : icon}
                    </label>
                </>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    id={id}
                    className={styles.dropzone}>
                    {uploading && (<div className={styles.loadingBar} />)}
                        
                    <CloudUpload className='text-primary text-xl' />
                    <p>{t('DoDragDrop')}</p>
                    <h5 className='mt-0'>{t('OR')}</h5>
                    <input
                        type="file"
                        multiple={!singleFile}
                        hidden
                        style={{ display: 'none' }}
                        ref={inputRef}
                        accept={VideoOnly? 'video/mp4' : PDFOnly ? 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document' : onlyPNGJPJ ? 'image/png,image/jpeg' : ImageOnly ? 'image/png,image/jpeg,image/webp' : 'image/png,image/jpeg,application/pdf,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document'}
                        onChange={(e) => {
                            e.preventDefault();
                            if (singleFile && checkSingleFile(e.target.files))
                                OnOK(e.target.files);
                            else if (!singleFile) {
                                let files = checkMultiFile(e.target.files);
                                if (files.length > 0)
                                    OnOK(files);
                            }
                        }}
                    />
                    <Button type='primary' onClick={(e: any) => {
                        e.preventDefault();
                        inputRef.current.click();
                    }
                    }>
                        {singleFile ? t('ClickToSelectFile') : t('ClickToSelectFiles')}
                    </Button>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>{VideoOnly? `${t("AcceptedFormats")}: MP4` : PDFOnly ? `${t("AcceptedFormats")}: PDF, docx` : onlyPNGJPJ ? `${t("AcceptedFormats")}: PNG, JPG, JPEG` : ImageOnly ? `${t("AcceptedFormats")}: PNG, JPG, JPEG, WebP` : `${t("AcceptedFormats")}: PNG, JPG, JPEG, WebP, PDF, docx`}</p>
                    {extra && <p style={{ marginBottom: '8px', fontSize: '12px' }}>{extra}</p>}
                </div>
            )}
        </>
    );
}

export default FileUploader;