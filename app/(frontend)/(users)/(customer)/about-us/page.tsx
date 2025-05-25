import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function AboutUs() {

    const faqs = [
        {
            question: "How do I know the status of my application?",
            answer:
                "Once you submit your application, you will receive a confirmation email. Our team will review your application and get back to you within 3-5 business days.",
        },
        {
            question: "What if I have questions about the adoption process?",
            answer:
                "If you have any questions, feel free to reach out to us via our contact page or email us at support@fureverfriends.com. We are here to help!",
        },
        {
            question: "Is the information I see here up-to-date?",
            answer:
                "Yes, we strive to keep all information on our site as current as possible. However, please note that availability may change quickly, so it's always best to check back frequently.",
        },
        {
            question: "How can I donate to shelters?",
            answer:
                "You can donate directly through our platform by visiting the 'Donate' section. Your contributions will go directly to the shelters in need.",
        },

    ];

    return (
        <>
            <header className="h-80 w-full rounded-b-[500px] bg-primary mt-0 border-0">
                <div className="w-full overflow-hidden leading-[0]">
                    <Image
                        className="absolute mt-10 z-10"
                        src='/images/tail.svg'
                        alt='paw'
                        width={200}
                        height={200}
                    />

                </div>
                <h1 className="text-5xl text-center text-white font-bold pt-32">
                    About Us
                </h1>
                <p className="p-4 text-center w-4/6 mx-auto font-extralight font-sm text-gray-200">Fur-Ever Friends serves as an inclusive pet adoption platform, facilitating seamless searches for one's ideal companion, while offering shelters the
                    opportunity to showcase diverse species available for adoption. Additional services include ethical rehoming services and lost pet alerts.</p>
            </header>
            <main className="flex flex-col items-center justify-center w-full space-y-4 h-full p-4">
                <h1 className=" text-3xl text-black mt-10">Our Mission</h1>
                <p className="p-2 text-justified w-4/6 mx-auto font-extralight text-sm text-gray-800">At Fur-Ever Friends, our mission is to create a world where every pet finds a loving home. We believe in the power of companionship and the joy that pets bring to our lives. Our platform connects potential adopters with shelters and rescues, making the adoption process easier and more accessible for everyone.</p>

                <h1 className=" text-3xl text-black">FAQs</h1>
                {faqs.map((faq, index) => (
                    <Card
                        key={index}
                        className="w-full max-w-4xl bg-transparent shadow-lg p-4 mt-16"
                    >
                        <h2 className="font-semibold">{faq.question}</h2>
                        <p className="text-sm text-gray-800">{faq.answer}</p>
                    </Card>
                ))}
                <h1 className=" text-3xl text-black pt-16">Donate</h1>
                <p className="p-2 text-justified w-4/6 mx-auto font-extralight text-sm text-gray-800">Your contributions support shelters and rescues in their mission to care for animals in need. Every donation, big or small, makes a difference in the lives of these animals.</p>
                <p className="p-2 text-justified w-4/6 mx-auto font-extralight text-sm text-gray-800">To donate, please visit our <a href="/donate" className="text-blue-500 underline">donation page</a>, select a shelter and choose the amount you wish to contribute. Your generosity helps shelters provide food, medical care, and shelter for animals waiting for their forever homes.</p>
                <Link
                    href="/donate"
                    className={buttonVariants({
                        variant: "default",
                    })}
                >Donate Now</Link>
            </main>
        </>
    )
}