'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { Col, Input, Row, Select } from 'antd'
import { Mail, Phone, Pin } from 'lucide-react'
import { useState } from 'react'
import Star1 from '../shared/star1'
import Star2 from '../shared/star2'
import styles from './contact-us.module.css'

export default function ContactUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [personPosition, setPersonPosition] = useState('')
  const [personName, setPersonName] = useState('')

  const [type, setType] = useState('-1')
  const [content, setContent] = useState('')
   
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    content: '',
  })

  const validateForm = () => {
    const _errors: any = {}
    const emailReqex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!name) _errors.name = t('ThisFieldIsMandatory')
    if (!email) _errors.email = t('ThisFieldIsMandatory')
    else if (email && !emailReqex.test(email)) _errors.email = t('ThisEmailIsInvalid')
    if (!phone) _errors.phone = t('ThisFieldIsMandatory')
    if (type === '-1') _errors.type = t('ThisFieldIsMandatory')
    if (!content) _errors.content = t('ThisFieldIsMandatory')

    setErrors(_errors)
    return Object.keys(_errors).length === 0
  }

  return (
    <section className={styles.contactUs} id="contact">
      <Star2 styles={styles} />

      <Star1 styles={styles} />
      <div>
        <div className={styles.titleArea}>
          <span className={styles.subTitle} data-aos="fade-up">
            {t('Contact')}
          </span>
          <h2 className={styles.secTitle} data-aos="fade-up" data-aos-delay="200">
            {t('ContactTitle')}
          </h2>
          {/* <p className="sec-text"></p> */}
        </div>
      </div>

      <div className="container relative my-24 ">
        <Row>
          <Col xs={24} md={8}>
            <div>
              <div className="flex flex-col gap-2 mb-6 border-b-2 border-gray-500 w-fit pb-3 text-start">
                <h3 className="text-lg mb-2" data-aos="fade-up" data-aos-delay="400">
                  {t('OurLocation')}
                </h3>
                <div className="flex gap-2" data-aos="fade-up" data-aos-delay="600">
                  <Pin size={18} />
                  <span> {t('AtrasLinkLocation')}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6 text-start">
                <h3 className="text-lg mb-2" data-aos="fade-up" data-aos-delay="800">
                  {t('SayHello')}
                </h3>
                <div className="flex gap-2" data-aos="fade-up" data-aos-delay="1000">
                  <Phone size={18} />
                  <span style={{ direction: 'ltr', display: 'inline-block' }}>
                    +966 53 955 5262
                  </span>
                </div>

                <div className="flex gap-2" data-aos="fade-up" data-aos-delay="1100">
                  <Mail size={18} />
                  <span>support@atraslink.com</span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div>
              <form
                action=""
                className="contact-form"
                data-aos="fade-up"
                data-aos-delay="600"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (validateForm()) {
                    fetch('https://apis.cequens.net/email/send', {}).then(function (data) {
                      if (data.ok) {
                        // Swal.fire({
                        //     title: t('DoneSuccessfully'),
                        //     text: t('DoneSuccessfully1'),
                        //     icon: 'success',
                        //     confirmButtonText: t('Close')
                        // });
                        setName('')
                        setEmail('')
                        setPhone('')
                        setContent('')
                        setType('-1')
                      } else {
                        // Swal.fire({
                        //     title: t('AnErrorOccurred'),
                        //     text: t('AnErrorOccurred1'),
                        //     icon: "error",
                        //     confirmButtonText: t("OK"),
                        // });
                      }
                    })
                  }
                }}
              >
                <Row gutter={[20, 20]}>
                  <Col xs={24} md={12}>
                    <Input
                      type="text"
                      value={name}
                      size="large"
                      onChange={(e) => setName(resolvePersianAndArabicNumbers(e.target.value))}
                      placeholder={t('CompanyName*')}
                    />
                    {errors.name && <span className="error-msg">{errors.name}</span>}
                  </Col>
                  <Col xs={24} md={12}>
                    <Input
                      type="text"
                      size="large"
                      value={email}
                      onChange={(e) => setEmail(resolvePersianAndArabicNumbers(e.target.value))}
                      placeholder={t('Email*')}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </Col>
                  <Col xs={24} md={12}>
                    <Input
                      type="text"
                      value={personName}
                      size="large"
                      onChange={(e) =>
                        setPersonName(resolvePersianAndArabicNumbers(e.target.value))
                      }
                      placeholder={t('ContactPersonName')}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Input
                      type="text"
                      value={personPosition}
                      size="large"
                      onChange={(e) =>
                        setPersonPosition(resolvePersianAndArabicNumbers(e.target.value))
                      }
                      placeholder={t('ContactPersonPosition')}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Input
                      size="large"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(resolvePersianAndArabicNumbers(e.target.value))}
                      placeholder={t('Phone')}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </Col>
                  <Col xs={24} md={12}>
                    <Select
                      value={type}
                      className="w-full text-start"
                      virtual={false}
                      size="large"
                      popupClassName="landing-select"
                      onChange={(value) => setType(value)}
                    >
                      <Select.Option value={'-1'} disabled>
                        {t('MessageType*')}
                      </Select.Option>
                      <Select.Option value={t('1')}>{t('1')}</Select.Option>
                      <Select.Option value={t('2')}>{t('2')}</Select.Option>
                    </Select>
                    {errors.type && <span className="error-msg">{errors.type}</span>}
                  </Col>
                  <Col xs={24}>
                    <Input.TextArea
                      value={content}
                      rows={5}
                      onChange={(e) => setContent(resolvePersianAndArabicNumbers(e.target.value))}
                      placeholder={t('YourMessage*')}
                    ></Input.TextArea>
                    {errors.content && <span className="error-msg">{errors.content}</span>}
                  </Col>
                  <Col xs={24}>
                    <button className={styles.btn}>{t('SendYourMassage')}</button>
                  </Col>
                </Row>
              </form>
            </div>
          </Col>
        </Row>
      </div>

    </section>
  )
}
