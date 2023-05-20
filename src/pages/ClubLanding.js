import React, { useEffect, useLayoutEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import { toast } from "react-hot-toast";
import { fetchClubGeneralDetails } from "../API/calls";
import { useParams } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import { IoLogoInstagram, IoLogoWhatsapp, IoMail, IoLogoLinkedin, IoLogoYoutube, IoLogoFacebook, IoLogoTwitter } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { Icon } from '@iconify/react';
import Feed from "../components/Feed";

const ClubLanding = () => {
  const { id } = useParams();

  const [photos, setPhotos] = useState([]);
  const [details, setDetails] = useState(null);
  const [aboutHeight, setAboutHeight] = useState(0);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    toast.promise(fetchClubGeneralDetails(id), {
      loading: "Loading...",
      success: (res) => {
        setDetails(res.data);
        setAboutHeight(document.getElementById("about")?.clientHeight);
        return "Successfully loaded!";
      },
      error: (err) => {
        console.log(err);
        return "Error loading";
      },
    });
  }, [id]);

  useEffect(() => {
    axios
      .get("https://picsum.photos/v2/list?page=2&limit=10")
      .then((res) => {
        setPhotos(res.data.map((d) => d.download_url));
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      const height = document.getElementById("about")?.clientHeight;
      setAboutHeight(height);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      const y = document.getElementById("feed").getBoundingClientRect().top;

      if (y <= 85) {
        setSticky(true);
        const feedDiv = document.getElementById("feed");
        if (feedDiv) { feedDiv.style.maxHeight = `${aboutHeight}px`; }
      } else {
        setSticky(false);
        const feedDiv = document.getElementById("feed");
        if (feedDiv) { feedDiv.style.maxHeight = `none`; }
      }
    }
    window.addEventListener("scroll", updateSize);
    updateSize();
    return () => window.removeEventListener("scroll", updateSize);
  }, [aboutHeight]);

  return (
    <Layout>
      <div className="w-full">
        <div
          className="h-[7.5rem] lg:h-[15rem] w-full"
          style={
            details
              ? {
                background: `url(${details.general?.banner_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
              : {
                background: "#797979",
              }
          }
        ></div>
        <div className="flex flex-col lg:flex-row items-center space-x-6 -mt-12 lg:-mt-36">
          <img
            className="w-32 h-32 lg:w-64 lg:h-64 aspect-square rounded-full bg-gray-100 border-4 lg:border-8 border-gray-200 lg:ml-16 object-contain"
            src={details?.general?.image_url ? details?.general?.image_url : "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/PSG_College_of_Technology_logo.png/220px-PSG_College_of_Technology_logo.png"}
            alt="club-logo"
          />
          <div className="pt-4 lg:pt-36 pr-4 lg:pr-0 text-center lg:text-left">
            <p className="text-gray-800 font-sans text-2xl lg:text-4xl font-bold">
              {details ? details.clubName : "Loading.."}{" "}
            </p>
            <p className="text-gray-600 pt-1">
              {details?.general?.tagline && details.general.tagline !== "No tagline provided" && details.general.tagline}
              {details?.general?.website &&
                <button className="sm:inline-block pl-2 sm:pl-0"
                  onClick={() => { window.open(details.general.website.startsWith("http") ? details.general.website : "https://" + details.general.website) }}
                >
                  {details?.general?.tagline && details.general.tagline !== "No tagline provided" && <p className="hidden sm:inline-block mx-2">{' | '}</p>}
                  <p className="sm:inline-block font-semibold hover:underline hover:text-blue-600">{details.general.website}</p>
                </button>
              }</p>
          </div>
        </div>
        {/* <div className="lg:hidden w-full h-0.5 mt-6 bg-gray-500"></div> */}

        <div className="flex flex-col lg:flex-row w-full items-center lg:items-start gap-8 my-8">
          <div className={`flex flex-col gap-8 w-full lg:w-1/4`} id='about'>
            <section className="lg:bg-gray-200 rounded-lg lg:p-8 px-6 flex flex-col items-center lg:items-start">
              <div className="text-gray-700 text-xl font-bold border-t-4 border-t-gray-400 lg:border-0 pt-2 lg:pt-0">About Us</div>
              <p className="text-base text-gray-500 mt-6 text-justify lg:text-left">
                {details?.general?.description ||
                  "No description provided"}
              </p>
              {
                details?.general?.website && (
                  <p className="mt-2 text-base flex flex-col items-center lg:items-start">
                    <span className="">For More Information</span>
                    <button className="text-blue-600 hover:underline font-semibold flex items-center space-x-2" onClick={() => {
                      window.open(details.general.website.startsWith("http") ? details.general.website : "https://" + details.general.website)
                    }}
                    >
                      <AiOutlineLink />
                      <p className="">Click Here</p>
                    </button>
                  </p>
                )}
            </section>

            <div className="hidden lg:block">
              <Contact generalDetails={details} />
            </div>
          </div>

          <div className={`flex flex-col gap-8 w-full lg:w-1/2 items-center overflow-auto`}
            // style={{ maxHeight: aboutHeight, minHeight: "800px" }}
            id='feed'
          >
            <div className="lg:hidden text-gray-700 text-xl font-bold pt-2 -mb-2 border-t-4 border-t-gray-400">Posts</div>
            {/* <div className={`w-full ${sticky ? "fixed" : ""}`}> */}
            <Feed id={id} />
            {/* </div> */}
          </div>

          <div className="flex flex-col gap-8 w-full lg:w-1/4 items-center lg:items-start">
            <p className="lg:hidden text-xl text-gray-700 font-bold pt-2 -mb-4 border-t-4 border-t-gray-400">Photos</p>
            <section className="lg:bg-gray-200 rounded-lg lg:p-8 px-6 w-full">
              <p className="hidden lg:block text-xl text-gray-700 font-bold">Photos</p>
              <div className="grid grid-cols-3 gap-1 mt-6">
                {photos.map((p, idx) => (
                  <div
                    style={{
                      background: `url(${p})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="aspect-square"
                  />
                ))}
              </div>
            </section>

            <div className="lg:hidden w-full">
              <Contact generalDetails={details} />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row gap-8 ">
        <div className="w-1/2">
          <section className="lg:bg-gray-200 rounded-lg lg:p-8 px-6 w-full">
            <p className="text-xl text-gray-700 font-bold">Faculty Advisors</p>
          </section>
        </div>

        <div className="w-1/2">
          <section className="lg:bg-gray-200 rounded-lg lg:p-8 px-6 w-full">
            <p className="text-xl text-gray-700 font-bold">Our Team</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

const Contact = ({ generalDetails }) => {

  const content = generalDetails?.general;

  return (
    <div>
      {
        content?.contactName1 && (content?.contactNumber1 || content?.contactEmail1) && (
          <div className="lg:bg-gray-200 flex-1 flex flex-col rounded-lg px-6 lg:p-8 space-y-6 items-center lg:items-start">
            <p className="text-xl font-bold text-gray-700 border-t-4 border-t-gray-400 lg:border-0 pt-2 lg:pt-0">
              Contact Us
            </p>

            <Person
              name={content?.contactName1}
              phone={content?.contactNumber1}
              email={content?.contactEmail1}
            />

            {content?.contactName2 && (content?.contactNumber2 || content?.contactEmail2) && (
              <Person
                name={content?.contactName2}
                phone={content?.contactNumber2}
                email={content?.contactEmail2}
              />
            )}

            {(content?.instagram || content?.linkedin || content?.linktree || content?.youtube || content?.facebook || content?.twitter || content?.discord) && (
              <p className="text-xl font-bold text-gray-700 pt-4">
                Socials
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6">
              {content?.instagram && (<Social
                link={content?.instagram.startsWith("http") ? content?.instagram : "https://" + content?.instagram}
                icon={<IoLogoInstagram />}
              />)}
              {content?.linkedin && (<Social
                link={content?.linkedin.startsWith("http") ? content?.linkedin : "https://" + content?.linkedin}
                icon={<IoLogoLinkedin />}
              />)}
              {content?.linktree && (<Social
                link={content?.linktree.startsWith("http") ? content?.linktree : "https://" + content?.linktree}
                icon={<Icon icon="simple-icons:linktree" />}
              />)}
              {content?.youtube && (<Social
                link={content?.youtube.startsWith("http") ? content?.youtube : "https://" + content?.youtube}
                icon={<IoLogoYoutube />}
              />)}
              {content?.facebook && (<Social
                link={content?.facebook.startsWith("http") ? content?.facebook : "https://" + content?.facebook}
                icon={<IoLogoFacebook />}
              />)}
              {content?.twitter && (<Social
                link={content?.twitter.startsWith("http") ? content?.twitter : "https://" + content?.twitter}
                icon={<IoLogoTwitter />}
              />)}
              {content?.discord && (<Social
                link={content?.discord.startsWith("http") ? content?.discord : "https://" + content?.discord}
                icon={<Icon icon="simple-icons:discord" />}
              />)}
            </div>
          </div>
        )}
    </div>
  )
}

const Person = ({ name, phone, email }) => {

  const toTitleCase = (phrase) => {
    return phrase?.toLowerCase()
      .split(" ")
      .map((word) => { return word.charAt(0).toUpperCase() + word.slice(1); })
      .join(" ");
  };

  return (
    <div className="flex flex-wrap items-center justify-between w-full">
      <div className="w-[59%]">
        <p className="font-semibold text-[#3c4043] whitespace-nowrap">
          {toTitleCase(name)}
        </p>
        <p className="text-base lg:text-sm text-[#3c4043] whitespace-nowrap">
          {phone}
        </p>
        <p className="text-base lg:text-sm text-[#3c4043]">
          {email}
        </p>
      </div>

      <div className={`${name.length > 18 ? "pt-6" : "pt-4"} space-x-4`}>
        {phone && (<Social
          link={`tel:${phone.split(" ").join("")}`}
          icon={<IoMdCall />}
        />)}
        {phone && (<Social
          link={`https://wa.me/${phone.split(" ").join("")}`}
          icon={<IoLogoWhatsapp />}
        />)}
        {email && (<Social
          link={`mailto:${email}`}
          icon={<IoMail />}
        />)}
      </div>
    </div>
  )
}

const Social = ({ link, icon }) => {
  return (
    <button
      className="hover:-translate-y-2 transition-all duration-500 ease-in-out text-gray-700 hover:text-black text-2xl"
      onClick={() => {
        window.open(link);
      }}
    >
      {icon}
    </button>
  )
}

export default ClubLanding;
