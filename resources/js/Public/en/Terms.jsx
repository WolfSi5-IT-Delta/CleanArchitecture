import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import {
  AnnotationIcon,
  ChatAlt2Icon,
  ChatAltIcon,
  DocumentReportIcon,
  HeartIcon,
  InboxIcon,
  MenuIcon,
  PencilAltIcon,
  QuestionMarkCircleIcon,
  ReplyIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'

const features = [
  {
    name: 'Unlimited Inboxes',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: InboxIcon,
  },
  {
    name: 'Manage Team Members',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: UsersIcon,
  },
  {
    name: 'Spam Report',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: TrashIcon,
  },
  {
    name: 'Compose in Markdown',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: PencilAltIcon,
  },
  {
    name: 'Team Reporting',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: DocumentReportIcon,
  },
  {
    name: 'Saved Replies',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ReplyIcon,
  },
  {
    name: 'Email Commenting',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: ChatAltIcon,
  },
  {
    name: 'Connect with Customers',
    description: 'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
    icon: HeartIcon,
  },
]
const metrics = [
  { id: 1, stat: '8K+', emphasis: 'Companies', rest: 'use laoreet amet lacus nibh integer quis.' },
  { id: 2, stat: '25K+', emphasis: 'Countries around the globe', rest: 'lacus nibh integer quis.' },
  { id: 3, stat: '98%', emphasis: 'Customer satisfaction', rest: 'laoreet amet lacus nibh integer quis.' },
  { id: 4, stat: '12M+', emphasis: 'Issues resolved', rest: 'lacus nibh integer quis.' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Index() {
  return (

    <main>
      {/* Hero section */}
      <div className="relative pt-10">
        <div className="max-w-4xl rounded-tl-lg rounded-tr-lg mx-auto shadow-lg text-2xl">

          <div className="flex items-center rounded-tl-lg rounded-tr-lg justify-center bg-gray-100 h-full py-6 text-gray-700">
            Terms Of Service
          </div>

          <div className="items-center justify-center bg-white h-full mx-10 my-10 pb-10 text-gray-500">

            <div>
              <div className="text-[17.5px] outline-offset-4">
                This license is a legal agreement between you and LEARNING CENTER for the use of LEARNING CENTER Software
                (the “Software”). By downloading any LEARNING CENTER files, add-ons, or resources, you agree to be bound by the
                terms and conditions of this license. LEARNING CENTER reserves the right to alter this agreement at any time,
                for any reason, without notice.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Permitted Use
              </div>
              <div className="text-[17.5px] outline-offset-4">
                One Single Site license grants the right to use the Software on one domain and unlimited development
                sites. Each additional domain using the Software requires an additional purchased license.
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                One Unlimited Site license grants the right to use the Software on unlimited domains and unlimited
                development sites.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Restrictions
              </div>
              <div className="text-[17.5px] outline-offset-4">
                Unless you have been granted prior, written consent from LEARNING CENTER, you may not:
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                Reproduce, distribute, or transfer the Software, or portions thereof, to any third party. Sell, rent,
                lease, assign, or sublet the Software or portions thereof. Grant rights to any other person. Use the
                Software in violation of any Bangladesh or U.S. or international law or regulation. Making Copies You
                may make copies of the Software for back-up purposes, provided that you reproduce the Software in its
                original form and with all proprietary notices on the back-up copy.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Software Modification
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                You may alter, modify, or extend the Software for your own use, or commission a third-party to perform
                modifications for you, but you may not resell, redistribute or transfer the modified or derivative
                version without prior written consent from LEARNING CENTER. Components from the Software may not be extracted
                and used in other programs without prior written consent from LEARNING CENTER.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Technical Support
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                LEARNING CENTER does not provide direct phone support at this time. No representations or guarantees are made
                regarding the response time in which e-mail or Chat support questions are answered, but I will do my
                best to respond quickly.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Refunds
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                LEARNING CENTER offers limited refunds on software within 15 days of purchase. Contact support@learningcenter.com
                for assistance.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Indemnity
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                You agree to indemnify and hold harmless LEARNING CENTER for any third-party claims, actions or suits, as well
                as any related expenses, liabilities, damages, settlements or fees arising from your use or misuse of
                the Software, or a violation of any terms of this license.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Disclaimer Of Warranty
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESSED OR IMPLIED, INCLUDING, BUT
                NOT LIMITED TO, WARRANTIES OF QUALITY, PERFORMANCE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR
                A PARTICULAR PURPOSE. FURTHER, LEARNING CENTER DOES NOT WARRANT THAT THE SOFTWARE OR ANY RELATED SERVICE WILL
                ALWAYS BE AVAILABLE.
              </div>
            </div>

            <div>
              <div className="text-3xl mt-16 text-gray-900">
                Limitations Of Liability
              </div>
              <div className="text-[17.5px] outline-offset-4 mt-5">
                YOU ASSUME ALL RISK ASSOCIATED WITH THE INSTALLATION AND USE OF THE SOFTWARE. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS OF THE SOFTWARE BE LIABLE FOR CLAIMS, DAMAGES OR OTHER LIABILITY ARISING
                FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE. LICENSE HOLDERS ARE SOLELY RESPONSIBLE FOR
                DETERMINING THE APPROPRIATENESS OF USE AND ASSUME ALL RISKS ASSOCIATED WITH ITS USE, INCLUDING BUT NOT
                LIMITED TO THE RISKS OF PROGRAM ERRORS, DAMAGE TO EQUIPMENT, LOSS OF DATA OR SOFTWARE PROGRAMS, OR
                UNAVAILABILITY OR INTERRUPTION OF OPERATIONS.
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>

  )
}
