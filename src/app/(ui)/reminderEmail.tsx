import dayjs from 'dayjs';
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button
} from '@react-email/components'

interface ReminderEmailProps {
  email: string,
  title: string,
  plannedDateOfCompletion :any
}

export default function ReminderEmail({
  email,
  title,
  plannedDateOfCompletion,
}: ReminderEmailProps) {
  return (
    <Html lang='en' dir='ltr'>
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily='Roboto'
          fallbackFontFamily='Verdana'
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle='normal'
        />
      </Head>
      <Preview>Reminder for planned activity expiry for title: {title}</Preview>
      <Section>
        <Row>
          <Heading as='h2'>Hello {email},</Heading>
        </Row>
        <Row>
          <Heading as='h1'>Task titled : {title},</Heading>
        </Row>
        <Row>
          <Text>
            Please complete the todo task or extend the planned completion date.
          </Text>
        </Row>
        <Row>
          <Text>Expired on {dayjs(plannedDateOfCompletion).format('DD/MM/YYYY')}</Text>
        </Row>
       
        {/* <Row>
            <Button
              href={`http://localhost:3000/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              Verify here
            </Button>
          </Row> */}
      </Section>
    </Html>
  )
}
