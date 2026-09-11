import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Phone, Verified, Share } from "@mui/icons-material";
import Rating from "@mui/material/Rating";
import Stars from "../../others/Stars";
// import QrCodeGenerator from "../../others/QrCodeGenerator.jsx";

const ProfileCardWrapper = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, #7fa5bbff 0%, #2c3e50 100%)`,
  color: "white",
  borderRadius: "16px",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(52, 73, 85, 0.3)",
  position: "relative",
  textAlign: "center",
  direction: "rtl",
  minHeight: "250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(2),
  left: theme.spacing(2),
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
}));

export default function RealstateCard(props) {
  const realstate = props.realstate;
  const slug = props.slug;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        // title: `${realstate.name} ${realstate.family}`,
        text: ` صفحه اختصاصی   ${realstate.name} ${realstate.family}  در املاک هوشمند آجر`,
        url: `https://ajur.app/realestates/${realstate.id}`,
      })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `https://ajur.app/realestates/${realstate.id}`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert('لینک کپی شد!'))
        .catch((error) => console.log('Error copying:', error));
    }
  };

  return (
    <ProfileCardWrapper>
      {/* Share Button - Top Left */}
      <ShareButton aria-label="share" onClick={handleShare}>
        <Share />
      </ShareButton>

      {/* Main Content - Centered */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        width: "100%",
      }}>

        {/* Profile Image with Blue Tick - Centered */}
        <Box sx={{ position: "relative" }}>
          <Avatar
            alt={`تصویر پروفایل ${realstate.name} ${realstate.family} مشاور املاک`}
            src={realstate.profile_url}
            imgProps={{ loading: "lazy" }}
            sx={{
              width: 130,
              height: 130,
              border: "3px solid white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          />
          {realstate.verified && (
            <Verified
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                fontSize: 32,
                color: "#1976d2",
                backgroundColor: "white",
                borderRadius: "50%",
                padding: "4px",
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          )}
        </Box>

        {/* Name and Family - Centered */}
        <Box sx={{ textAlign: "center", width: "100%" }}>
          <Typography variant="h4" sx={{
            fontWeight: "bold",
            textAlign: "center",
            lineHeight: 1,
            mb: 0.5,
          }}>
            {realstate.name} {realstate.family}
          </Typography>
        </Box>

        <Box sx={{
          textAlign: "center",
          width: "100%",
          maxWidth: "600px",
          mx: "auto",
        }}>
          <Typography variant="body1" sx={{
            color: "white",
            opacity: 0.9,
            textAlign: "center",
            lineHeight: 1,
          }}>
            {realstate.description || "توضیحی درباره مشاور املاک ثبت نشده است."}
          </Typography>
        </Box>

        {/* Phone - Centered */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          width: "100%",
        }}>
          <Phone sx={{ fontSize: 20, color: "white" }} />
          <Typography variant="h6" sx={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
          }}>
            {realstate.phone || "۰۹۱۲XXX‌۳۴۵"}
          </Typography>
        </Box>

        {/* Rating - Centered */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          width: "100%",
        }}>
          <Rating
            value={parseFloat(realstate.stars) || 0}
            readOnly
            precision={0.5}
            sx={{
              "& .MuiRating-iconFilled": { color: "#ffd700" },
              direction: "ltr",
            }}
          />

        </Box>

        {/* Description - Centered */}


        {/* Stars Section - Centered */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mt: 1,
        }}>


        </Box>

        {/* QR Code - Commented Out */}
        {/* 
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <QrCodeGenerator 
            url={"https://ajur.app/realestates/" + realstate.id + "?slug=" + slug}  
            title='اسکن کنید'
          />
        </Box>
        */}
      </Box>
    </ProfileCardWrapper>
  );
}
