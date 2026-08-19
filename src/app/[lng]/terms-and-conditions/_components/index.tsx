import { getTranslation } from '@/app/i18n'
import styles from '@/components/landing-page/hero/hero.module.css'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Card } from 'antd'
import { CollapseProps } from 'antd/lib'

export default async function Terms({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng)
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: lng === 'ar' ? 'مقدمة' : 'Introduction',
      children: (
        <>
          {lng === 'ar' ? (
            <div className="text-[#eee]">
              <p className="font-semibold">
                إن استخدامك لموقع أتراس لينك أو أحد خدماته تعد موافقة على الشروط والأحكام الخاصة
                بنا:
              </p>
              <ul className="list-disc list-inside mt-3">
                <li>
                  جميع الشروط والأحكام يخضع لها موقع أتراس لينك، ووصولك للموقع وطلب الخدمات أو
                  المنتجات من خلاله تعني موافقتك الكاملة على جميع الشروط والأحكام.
                </li>
                <li className="mt-2">
                  عليك الاطلاع على “سياسة الخصوصية” و “الاستبدال والاسترجاع” و “الشحن والتوصيل”
                  الخاصة بنا والتي توفر المعلومات الكاملة حول التعامل مع موقع أتراس لينك.
                </li>
              </ul>
            </div>
          ) : (
            <div className="text-[#eee]">
              <p className="font-semibold">
                Using the Atras Link website or any of its services constitutes your acceptance of
                our terms and conditions:
              </p>
              <ul className="list-disc list-inside mt-3">
                <li>
                  Acceptance: All interactions with Atras Link, including accessing the website and
                  requesting services or products, indicate full agreement with these terms.{' '}
                </li>
                <li className="mt-2">
                  Policies: You are encouraged to review our Privacy Policy, Return and Refund
                  Policy, and Shipping and Delivery Policy, which outline comprehensive guidelines
                  for engaging with Atras Link.{' '}
                </li>
              </ul>
            </div>
          )}
        </>
      ),
    },
    {
      key: '2',
      label: lng === 'ar' ? 'الحفاظ على الحساب والمعلومات' : 'Account Security and Information',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              يتطلب إنشاء حساب على موقع أتراس لينك من أجل طلب الخدمة أن تمنحنا بعض المعلومات
              الشخصية، يجب أن تكون جميع هذه المعلومات صحيحة ودقيقة، وأن تقوم بتحديث هذه المعلومات.{' '}
              <br />
              <br />
              لا يجوز انتحال اسم أي شخص آخر أو كيان من أجل التسجيل. إذا اكتشفنا قيامك بذلك، سوف نقوم
              بإلغاء حسابك على الفور ووقف التعامل معك. <br />
              <br />
              أنت المسؤول عن الحفاظ على حسابك ومعلوماتك الشخصية. لهذا عليك استخدام أجهزتك الشخصية،
              وعدم مشاركة معلوماتك الشخصية مع أطراف ثالثة أو السماح لأي شخص آخر بالوصول إلى حسابك.{' '}
              <br />
              <br />
              إذا شعرت بأن هناك نشاطًا غريبًا يحدث في حسابك عليك إخبارنا على الفور من أجل أخذ
              الاحتياطات اللازمة بشأنها. <br />
              <br />
              أنت تتحمل المسؤولية الكاملة حول أي نشاط يصدر من حسابك، وكذلك أي خسائر يتكبدها موقع
              أتراس لينك والآخرين.
            </p>
          ) : (
            <p className="text-[#eee]">
              Creating an account requires providing accurate and up-to-date personal information.{' '}
              <br />
              <br />
              Impersonation of any individual or entity is strictly prohibited and will result in
              immediate account termination. <br />
              <br />
              You are responsible for safeguarding your account credentials. Use personal devices
              and avoid sharing your details with third parties. <br />
              <br />
              Notify us immediately if you notice any suspicious activity in your account so that
              appropriate precautions can be taken. <br />
              <br />
              {
                "You are fully accountable for all activities conducted through your account, as well as any losses incurred by Atras Link or others due to your account's misuse."
              }
            </p>
          )}
        </>
      ),
    },
    {
      key: '3',
      label: lng === 'ar' ? 'الأسعار' : 'Pricing',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              يحق لـ موقع أتراس لينك تغيير الأسعار تحت أي ظرف باستثناء الأسعار المسجلة في الفاتورة.
            </p>
          ) : (
            <p className="text-[#eee]">
              Atras Link reserves the right to adjust prices under any circumstances, except for
              prices already documented on an invoice.
            </p>
          )}
        </>
      ),
    },
    {
      key: '4',
      label: lng === 'ar' ? 'حقوق الملكية الفكرية' : 'Intellectual Property Rights',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              الخدمات والمنتجات الخاصة بنا مملوكة لموقع أتراس لينك، ولا يجوز انتهاكها بأي حال من
              الأحوال.
              <br />
              <br />
              جميع العلامات التجارية الأخرى وأسماء المنتجات وأسماء الشركات والشعارات التي تظهر في
              موقعنا هي ملك لأصحابها المعنيين.
            </p>
          ) : (
            <p className="text-[#eee]">
              All services and products are the property of Atras Link and must not be misused or
              infringed upon. <br />
              <br />
              Trademarks, product names, company names, and logos displayed on the site belong to
              their respective owners.
            </p>
          )}
        </>
      ),
    },
    {
      key: '5',
      label: lng === 'ar' ? 'تحديثات الشروط والأحكام' : 'Updates to Terms and Conditions',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              يحق لنا في أي وقت القيام بتغيير في الشروط والأحكام الخاصة بنا من أجل توفير الخدمات
              لجميع العملاء بشكل أفضل.
              <br />
              <br />
              يرجي منك الاطلاع على هذه الصفحة دائمًا لمعرفة آخر التحديثات التي قمنا بها.
              <br />
              <br />
              استمرارك في طلب الخدمات والمنتجات من خلالنا بعد تغيير الشروط والأحكام يدل على موافقتك
              التامة على هذه التغييرات التي قمنا بها.
            </p>
          ) : (
            <p className="text-[#eee]">
              We reserve the right to modify these terms and conditions at any time to enhance the
              quality of our services for all customers. <br />
              <br />
              Please regularly review this page to stay informed about any updates. Continued use of
              our services after updates signifies your acceptance of the revised terms.
            </p>
          )}
        </>
      ),
    },
  ]

  return (
    <div className={`${styles.hero} min-h-screen`} id="hero">
      <div className="container">
        <section className="max-w-5xl mt-32 mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-white">
              {t('TermsOfService')}
            </h2>
          </div>
          <div className="space-y-8">
            {items.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 text-xl items-center justify-center pt-1 rounded-full bg-black text-white font-bold">
                  {index + 1}
                </div>
                <Card className="w-full !bg-transparent text-start overflow-hidden">
                  <CardHeader className="bg-black/30 text-white py-4">
                    <h4 className="text-lg font-semibold">{step.label}</h4>
                  </CardHeader>
                  <CardContent className="py-4">{step.children}</CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* <Row align="middle" justify="center" className='min-h-screen pt-[70px]'>
          <Col xs={24} lg={12}>
            <Collapse className='min-w-full w-full' accordion items={items} defaultActiveKey={['1']} />

          </Col>
       
        </Row> */}
      </div>
    </div>
  )
}
