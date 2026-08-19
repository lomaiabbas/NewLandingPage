import { getTranslation } from '@/app/i18n'
import styles from '@/components/landing-page/hero/hero.module.css'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Card } from 'antd'
import { CollapseProps } from 'antd/lib'

export default async function PrivacyPolicy({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng)
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label:
        lng === 'ar'
          ? 'المعلومات التي يتحصل عليها موقع أتراس لينك ويحتفظ بها في قواعد بياناته'
          : 'Information Collected and Stored by Atras Link',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              المعلومات الشخصية الخاصة بالمستخدم، كالإسم والعمر والبريد الالكتروني، ورقم الهوية
              الوطنية أو رقم الإقامة. <br />
              <br />
              المعلومات التجارية الخاصة بالشركة، كالسجل التجاري والبريد الإلكتروني، وبيانات الشركة،
              ووسائل الربط والاتصال.
              <br />
              <br />
              معلومات الدخول الشخصية الخاصة بالمستخدم، مثل اسم المستخدم وكلمة السر والبريد
              الالكتروني، والسؤال الخاص باسترجاع كلمة السر وإجابته.
              <br />
              <br />
              قد تفرض طبيعة المنصة الالكترونية بعض المعلومات المتعلّقة بالكوكيز وذلك لأغراض
              الكترونية تسهّل التعامل بين الموقع والمستخدم.
            </p>
          ) : (
            <p className="text-[#eee]">
              Atras Link collects and retains the following types of information in its databases:
              <br />
              <br />
              <ul style={{ listStyle: 'inside' }}>
                <li>
                  <b>Personal Information:</b> User details such as name, age, email address, and
                  national ID or residence number.
                </li>
                <li>
                  <b>Business Information:</b> Company-related data, including commercial
                  registration, email address, company details, and contact methods.
                </li>
                <li>
                  <b>Login Information:</b> User credentials, such as username, password, email
                  address, and the security question and its answer for password recovery.
                </li>
                <li>
                  <b>Cookies Data:</b> Due to the nature of the platform, certain information
                  related to cookies may be collected to facilitate and enhance interactions between
                  the site and the user.
                </li>
              </ul>
            </p>
          )}
        </>
      ),
    },
    {
      key: '2',
      label:
        lng === 'ar'
          ? 'هل موقع أتراس لينك يشارك هذه المعلومات؟'
          : 'Does Atras Link Share This Information?',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              بطبيعة الحال فإن موقع أتراس لينك يسعى بالاحتفاظ بهذه المعلومات بما يحفظ خصوصية
              المستخدم، وموقع أتراس لينك لا يحتفظ بهذه المعلومات إلا بهدف تحسين جودة الموقع
              الإلكتروني وتيسير التعامل فيما بين موقع أتراس لينك والمستخدم.
              <br />
              <br />
              كقاعدة عامة فإن جميع هذه المعلومات لا يطلع عليها إلا القائمين على موقع أتراس لينك، ولن
              يقوموا بنشرها أو بثها للغير.
              <br />
              <br />
              حيث أن موقع أتراس لينك يسعى للحفاظ على سلامة المستخدمين، فإنه – في حالة ملاحظة موقع
              أتراس لينك لأي نشاط غير نظامي أو غير شرعي يقوم به المستخدم – فإن موقع أتراس لينك قد
              يقوم بإبلاغ الجهات المختصة بعد دراسة الموضوع مع الممثل القانوني الخاص بـ موقع أتراس
              لينك.
            </p>
          ) : (
            <p className="text-[#eee]">
              Atras Link is committed to safeguarding user privacy and retains this information to
              improve the website&apos;s quality and facilitate user interactions with the platform.
              <br />
              <br />
              Generally, all collected data is accessible only to the Atras Link team and will not
              be disclosed or shared with third parties.
              <br />
              <br />
              However, to ensure the safety and security of its users, Atras Link reserves the right
              to report any irregular or unlawful activities observed by users to the relevant
              authorities, following a thorough review of the matter with Atras Link&apos;s legal
              representative.
            </p>
          )}
        </>
      ),
    },
    {
      key: '3',
      label:
        lng === 'ar'
          ? 'ما هو مدى أمان سرية المعلومات الخاصة بالموقع؟'
          : 'Data Security and Privacy Measures at Atras Link',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              يسعى موقع أتراس لينك إلى سرية المعلومات وسياسة الخصوصية الخاصة بالمستخدمين ولن تخالف
              أحكام هذه القواعد والسياسة. ولكن نظراً لعدم إمكانية ضمان ذلك 100% عبر وسائل الإنترنت
              فإن فريق عمل موقع أتراس لينك ينوّه بما يلي:
              <br />
              <br />
              يسعى موقع أتراس لينك بالحفاظ على جميع المعلومات الخاصة بالمستخدم وألا يطلع عليها أحد
              بما يخالف هذه السياسة المعمول بها في موقع أتراس لينك.
              <br />
              <br />
              تعمل على حماية هذه المعلومات عن طريق “سيرفرات معيّنة؟” محمية بموجب أنظمة الحماية
              الإلكترونية “نظامي برمجي أو Software معيّن؟”.
              <br />
              <br />
              غير أنه نظراً لأن شبكة الانترنت لا يمكن ضمانها 100% لما قد يطرأ من اختراق أو فيروسات
              على أنظمة الحماية الالكترونية وعلى جدران الحماية المعمول به في موقع أتراس لينك فإن
              موقع أتراس لينك ينصح المستخدمين بالحفاظ على معلوماتهم بسرية تامة، وعدم إفشاء أي
              معلومات يراها المستخدم هامة جداً له، وهذا حرصاً على موقع أتراس لينك في توجيه وإرشاد
              المستخدمين.
            </p>
          ) : (
            <p className="text-[#eee]">
              Atras Link is committed to maintaining user information confidentiality and adhering
              to its privacy policy. While every effort is made to comply with these rules and
              policies, it is important to acknowledge that 100% security cannot be guaranteed over
              the Internet. Therefore, the Atras Link team highlights the following:
              <br />
              <br />
              Atras Link endeavours to protect all user information and ensures that it is not
              accessed by anyone in violation of its established privacy policy.
              <br />
              <br />
              Data is safeguarded through specific servers secured by advanced cybersecurity systems
              and software.
              <br />
              <br />
              However, due to the inherent vulnerabilities of the internet, such as potential
              breaches or viruses, Atras Link advises users to maintain strict confidentiality of
              their sensitive information. Users should avoid sharing critical details to ensure
              their data remains secure. This guidance reflects Atras Link&apos;s dedication to
              protecting users and providing clear recommendations for data security.
            </p>
          )}
        </>
      ),
    },
    {
      key: '4',
      label:
        lng === 'ar'
          ? 'قواعد وأحكام استخدام موقع أتراس لينك'
          : 'Terms and Conditions for Using Atras Link',
      children: (
        <>
          {lng === 'ar' ? (
            <p className="text-[#eee]">
              إن جميع التزامات موقع أتراس لينك، وجميع التزامات المستخدمين، وجميع الحقوق الواردة في
              العلاقة بين المستخدم أو المستهلك وموقع أتراس لينك، موجودة هنا ، حيث أن هذه القواعد هي
              “سياسة الخصوصية وسرية المعلومات” والمنبثقة من الاتفاقية التي أبرمت بين المستخدم وموقع
              أتراس لينك بخصوص العلاقة النظامية والقانونية بينهما، وقد وضعت سياسة الخصوصية وسرية
              المعلومات لضمان المصداقية والثقة التي يحرص موقع أتراس لينك على توفيرها للمستخدمين.
            </p>
          ) : (
            <p className="text-[#eee]">
              All obligations of Atras Link, as well as the responsibilities of its users, and the
              rights governing the relationship between the user or consumer and Atras Link, are
              outlined here.
              <br />
              <br />
              These terms form the foundation of the Privacy Policy and Confidentiality Agreement,
              which stems from the contractual relationship between the user and Atras Link
              concerning their legal and regulatory interactions.
              <br />
              <br />
              The Privacy Policy and Confidentiality Agreement are designed to ensure credibility
              and trust\u2014values that Atras Link prioritizes in its commitment to serving its
              users.
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-white">{t('Privacy')}</h2>
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
