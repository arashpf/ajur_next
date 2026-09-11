import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "@mui/material/Link";
import SpinnerLoader from "../../SpinnerLoader";
// import Tab from "react-bootstrap/Tab";
// import Tabs from "react-bootstrap/Tabs";

import AppBar from "@mui/material/AppBar";
import "animate.css";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import Slider from "@mui/material/Slider";

import Grid from "@mui/material/Grid";
import Styles from "../../../styles/department/DepartmentPanel.module.css";
import RealStateSmalCard from "../../../cards/realestate/RealStateSmalCard";
import RealStateInDepartmentCard from "../../../cards/realestate/RealStateInDepartmentCard";
import WorkerCard from "../../../cards/WorkerCard";


// import LazyLoader from "../../../components/lazyLoader/Loading";
import LazyLoader from "../../../lazyLoader/Loading.js";

// import PanelWorkerCard from "../../../cards/PanelWorkerCard";
// import DepartmentWorkerCard from "../../../cards/DepartmentWorkerCard";
import dynamic from 'next/dynamic';
import WorkerCardSkeleton from "../../../skeleton/WorkerCardSkeleton";

const DepartmentWorkerCard = dynamic(() => import('../../../cards/DepartmentWorkerCard'), {
  loading: () => <WorkerCardSkeleton />,
});
import QrCodeGenerator from "../../../others/QrCodeGenerator.jsx";
import Share from "../../../marketers/Share";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CircleIcon from '@mui/icons-material/Circle';

import SortIcon from "@mui/icons-material/Sort";

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import SpeedDial from "@mui/material/SpeedDial";
import Add from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TuneIcon from "@mui/icons-material/Tune";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SettingsIcon from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import SpinnerModalLoader from "../../../panel/SpinnerModalLoader";
import CallIcon from "@mui/icons-material/Call";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { id } from "date-fns/locale";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const sortAgentsFilters = [
  { name: "بیشترین بازدید", english: "more_views" },
  { name: "بیشترین فایل", english: "more_files" },
  { name: "جدیدترین", english: "more_recents" },
];

const DepartmentPanel = (props) => {
  const router = useRouter();
  const user_from = props.user;
  const role = props.role;
  const [loading, set_loading] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [modal_kind, set_modal_kind] = React.useState("new_user");
  const [user, set_user] = useState();
  const [department, set_department] = useState();
  const [total_department_workers, set_total_department_workers] = useState([]);
  const [department_workers, set_department_workers] = useState([]);
  const [all_department_workers, set_all_department_workers] = useState([]);
  const [department_colleagues, set_department_colleagues] = useState([]);
  const [subcategories, set_subcategories] = useState([]);
  const [department_waited_colleagues, set_department_waited_colleagues] =
    useState([]);
  const [copySuccess, setCopySuccess] = useState("");
  const [problem, setProblem] = useState("test");
  const [open_snak, set_open_snak] = useState(false);

  const [key, setKey] = React.useState("files");

  const [value, setValue] = React.useState("files");
  const [sortKey, setSortKey] = React.useState("more_recents");
  const [filter_level, set_filter_level] = React.useState("base");
  const [filter_selected_category_name, set_filter_selected_category_name] =
    React.useState();

  const [filter_selected_region_name, set_filter_selected_region_name] =
    React.useState();

  const [selectedcat, set_selectedcat] = useState(false);

  const [normal_fields, set_normal_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);

  const [properties, set_properties] = useState([]);
  const [tick_properties, set_tick_properties] = useState([]);
  const [neighborhoods, set_neighborhoods] = useState([]);
  const [y_ofset, set_y_ofset] = useState(0);

  const [neighbor, set_neighbor] = useState();
  const [selected_neighborhoods, set_selected_neighborhoods] = useState([]);
  const [selected_neighborhoods_array, set_selected_neighborhoods_array] =
    useState([]);

  const [selected_tick_fileds, set_selected_tick_fileds] = useState([]);
  const [selected_tick_fileds_array, set_selected_tick_fileds_array] = useState(
    []
  );

  // const trigerEndofScroll = () => {
  //   set_y_ofset(window.scrollY);
  //   alert(window.scrollY);
  //   if (window.scrollY >= 300) {
  //     console.log('window.scrollY is ----------');


  //     console.log(window.scrollY);

  //     alert("secondary");
  //   } else if (window.scrollY <= 270) {
  //     console.log('window.scrollY is ----------');
  //     alert("main");
  //   }
  // };

  // useEffect(() => {
  //   trigerEndofScroll();
  //   alert('need to scroll');


  //   window.addEventListener("scroll", trigerEndofScroll);
  // }, [y_ofset]);

  useEffect(() => {

    var cookie_key = Cookies.get("cookie_secound_key");
    if (cookie_key) {
      setKey(cookie_key);
    }

  }, []);

  useEffect(() => {

    Cookies.set('cookie_secound_key', key, { expires: 200 });
  }, [key]);

  useEffect(() => {


    var selected_normal_field = normal_fields.filter((field) => {
      if (field.low !== 0 || field.high === properties) return field;
    });

    if (!selectedcat && selected_neighborhoods_array.length < 1) {
      set_department_workers([]);
      return;
    }

    // const old_workers = [...all_workers];
    const filtering_the_workers = all_department_workers.filter((worker) => {
      if (selectedcat === "all") return worker;

      if (selectedcat) {
        if (worker.category_id != selectedcat) return false;
      }

      if (selected_neighborhoods_array.length > 0) {
        // if (worker.neighborhood_id  > 1 ) return false;
        if (
          !selected_neighborhoods_array.includes(
            parseInt(worker.neighborhood_id)
          )
        )
          return false;
      }



      return worker;
    });

    const fitering_on_range = filtering_the_workers.filter((worker) => {
      const is_in_range = is_worker_in_range(worker);

      if (is_in_range) return worker;
    });

    set_department_workers(fitering_on_range);


  }, [selectedcat, selected_neighborhoods_array, properties, tick_properties]);

  const is_worker_in_range = (worker) => {
    const is_googd_to_go = true;
    var decoded_pr = JSON.parse(worker.json_properties);

    var selected_decoded_pr = decoded_pr.filter((pr) => {
      if (pr.special == 1) return pr;
    });

    normal_fields.map((nf) => {
      if (nf.special == 1) {
        if (nf.low > 0 || nf.high > 0) {
          const matched_pr_nf = selected_decoded_pr.find(function (pr) {
            return pr.name == nf.value;
          });

          const lower = nf.low > 0 ? parseInt(nf.low) : parseInt(nf.min_range);
          const higher =
            nf.high > 0 ? parseInt(nf.high) : parseInt(nf.max_range);
          if (matched_pr_nf) {
            if (matched_pr_nf.value > lower && matched_pr_nf.value < higher) {
            } else {
              is_googd_to_go = false;
            }
          }
        }
      }
    });


    tick_properties.map((ps) => {

      var selected_decoded_pr = decoded_pr.filter((pr) => {
        if (pr.kind == 2) return pr;
      });
      const matched_pr_tk = selected_decoded_pr.find(function (pr) {
        return pr.name == ps.name;
      });
      if (!matched_pr_tk) {

        is_googd_to_go = false;



      }
    });

    return is_googd_to_go;
  };

  // end of filtering in useeffect section

  useEffect(() => {
    if (selectedcat) {
      axios({
        method: "get",
        url: "https://api.ajur.app/api/category-fields",
        params: {
          cat: selectedcat,
        },
      }).then(function (response) {
        set_normal_fields(response.data.normal_fields);

        set_tick_fields(response.data.tick_fields);
        set_predefine_fields(response.data.predefine_fields);
      });
    }
  }, [selectedcat]);

  const handleSortChange = (event) => {
    setSortKey(event.target.value);

    onSortChangeClicked(event.target.value);

    // alert(event.target.value);
    setOpen(false);
  };

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(0) + " هزار "; // convert to K for number from > 1000 < 1 million
    } else if (num >= 1000000 && num < 1000000000) {
      return (num / 1000000).toFixed(0) + " میلیون "; // convert to M for number from > 1 million
    } else if (num >= 1000000000) {
      return (num / 1000000000).toFixed(0) + "میلیارد"; // convert to M for number from > 1 million
    } else if (num < 900) {
      return num; // if value < 1000, nothing to do
    }
  }

  function valuetext(value) {
    return `${value}°C`;
  }

  async function handleChangeSliderValue(
    event,
    newValue,
    activeThumb,
    fl,
    index
  ) {
    // var rounded_min_value = Math.ceil((newValue[0]+1)/10)*10;
    var rounded_min_value = newValue[0];
    // var rounded_high_value = Math.ceil((newValue[1]+1)/10)*10;
    var rounded_high_value = newValue[1];

    var filtered = normal_fields.filter((x) => {
      return x.id === fl.id;
    });

    if (activeThumb == 0) {
      await set_properties((filtered[0].low = rounded_min_value));
    }

    if (activeThumb == 1) {
      await set_properties((filtered[0].high = rounded_high_value));
    }

    return;

    set_properties(
      (normal_fields.filter((x) => {
        return x.id === fl.id;
      })[0].low = newValue[0]),
      ([0].high = newValue[1])
    );
    //  set_properties(normal_fields.filter(x => {return x.id === fl.id })
    //  [0].low = newValue[0],
    //  [0].high = newValue[1],
    // )

    //  set_properties(normal_fields.filter(x => {return x.id === fl.id })[0].high = newValue[1])

    // var valueSelected = properties.filter((item) => item.name == fl.value);

    // if (!Array.isArray(newValue)) {
    //   return;
    // }

    // if (newValue[1] - newValue[0] < minDistance) {
    //   if (activeThumb === 0) {
    //     const clamped = Math.min(newValue[0], 100 - minDistance);
    //     setValue2([clamped, clamped + minDistance]);
    //   } else {
    //     const clamped = Math.max(newValue[1], minDistance);
    //     setValue2([clamped - minDistance, clamped]);
    //   }
    // } else {
    //   setValue2(newValue);
    // }
  }

  function deleteFlFilter(fl) {
    var filtered = normal_fields.filter((x) => {
      return x.id === fl.id;
    });
    set_properties((filtered[0].low = 0));
    set_properties((filtered[0].high = 0));
  }

  function onSortChangeClicked(event) {
    var orginal_department_workers = department_workers;

    set_loading(true);

    if (event == "more_recents") {
      var sorted_department_workers = orginal_department_workers.sort(
        (a, b) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }
      );
      set_department_workers([]);
      set_department_workers(sorted_department_workers);

      set_loading(false);
    } else if (event == "more_updated") {
      var sorted_department_workers = orginal_department_workers.sort(
        (a, b) => {
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        }
      );
      set_department_workers([]);
      set_department_workers(sorted_department_workers);

      set_loading(false);
    } else if (event == "more_viewd") {
      // alert('more viewed is clicked');

      // set_department_workers(orginal_department_workers);

      var sorted_department_workers = orginal_department_workers.sort(
        (a, b) => {
          return (
            // new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            b.total_view - a.total_view
          );
        }
      );
      set_department_workers([]);
      set_department_workers(sorted_department_workers);

      set_loading(false);
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderNewAgentModal = () => {
    set_modal_kind("new_user");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnak = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    set_open_snak(false);
  };

  const onPopstateFuction = () => {
    history.pushState(null, "", router.asPath);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      history.pushState(null, "/", router.asPath);
      window.addEventListener("popstate", onPopstateFuction);
    }
    return () => {
      window.removeEventListener("popstate", onPopstateFuction);
    };
  }, [open]);

  const renderJoinRequests = () => {
    if (role == "رییس" || role == "مدیر") {
      return (
        department_waited_colleagues.length > 0 && (
          <Tab
            eventKey="jountrequest"
            title={
              <p style={{ fontSize: 15 }}>
                {"درخواست "} {"("} {department_waited_colleagues.length} {")"}

              </p>
            }
            className={Styles["personal-tab"]}
          >
            {role == "رییس" ||
              (role == "مدیر" && (
                <div className={Styles["new-wrapper"]}>
                  <Button
                    onClick={renderNewAgentModal}
                    variant="outlined"
                    startIcon={<PersonAddAlt1Icon />}
                  >
                    مشاور جدید
                  </Button>
                </div>
              ))}

            <div>
              <Grid item xs={12}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1}>
                    {renderDepartmentWaitedColleagues()}
                  </Grid>
                </Box>
              </Grid>
            </div>
          </Tab>
        )
      );
    }
  };

  const goToEditDepartment = () => {
    router.push("/panel/new_department");
  };

  const clickToOpenSortSelection = () => {
    set_modal_kind("sort");
    setOpen(true);
  };
  const clickToOpenFilterSelection = () => {
    set_modal_kind("filter");
    setOpen(true);
  };

  const handleChangeInput = (e) => {
    console.log("form changed");
    console.log(e.target.value);
  };

  const onClickSearchBox = () => {
    set_modal_kind("search");
    setOpen(true);
  };

  const renderSearchButton = () => {
    if (1) {
      return (
        <Paper className={Styles["search-wrapper"]} elevation={5}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              margin: "10px 2px",
              fontFamily: "iransans",
            }}
          >
            {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
      <DirectionsIcon />
      </IconButton> */}
            <InputBase
              onClick={onClickSearchBox}
              sx={{ ml: 1, flex: 1, direction: "rtl", fontFamily: "iransans" }}
              placeholder="جستجو منطقه ,مشاور، عنوان فایل  و ... "
              inputProps={{ "aria-label": "جستجو منطقه" }}
              onChange={handleChangeInput}
            />
            {/* <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton> */}
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton
              color="primary"
              sx={{ p: "10px" }}
              aria-label="directions"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Paper>
      );
    }
  };

  const renderSortButtonTitle = () => {
    if (sortKey == "more_recents") {
      return <div>جدیدترین </div>;
    } else if (sortKey == "more_viewd") {
      return <div>بیشترین بازدید</div>;
    } else if (sortKey == "more_updated") {
      return <div>جدیدترین بروز رسانی</div>;
    } else {
      return <div> مرتب سازی</div>;
    }
  };

  const renderDepartmentWorkersTabContent = () => {
    return (
      <Grid item xs={12} >
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={6} >
              <Button
                onClick={clickToOpenSortSelection}
                endIcon={<KeyboardArrowDownIcon />}
                variant="contained"
                size="medium"
                fullWidth
              >
                {renderSortButtonTitle()}
                <SortIcon />
              </Button>
            </Grid>

            <Grid item xs={6}>
              <Button
                onClick={clickToOpenFilterSelection}
                endIcon={<KeyboardArrowDownIcon />}
                variant="contained"
                size="medium"
                fullWidth
              >
                <div>فیلترها</div>
                <TuneIcon />
              </Button>
            </Grid>

            {renderDepartmentWorkers()}
          </Grid>
        </Box>
      </Grid>
    );
  };

  const renderDepartmentAgentsTabContent = () => {
    return (
      <Grid item xs={12}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {renderDepartmentColleaguesSortButtons()}
            {renderDepartmentColleagues()}
          </Grid>
        </Box>
      </Grid>
    );
  };

  const renderDepartmentAgentsWaitingTabContent = () => {
    return department_waited_colleagues.map((realstate) => (
      <Grid item md={6} xs={12} key={realstate.id}>
        <RealStateInDepartmentCard
          department={department}
          key={realstate.id}
          realstate={realstate}
        />
      </Grid>
    ));
  };

  // const renderTabContent = () => {
  //   if (value == "files") {
  //     return (
  //       <Grid item xs={12}>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Grid container spacing={3}>
  //             <Grid item xs={6}>
  //               <Button
  //                 onClick={clickToOpenSortSelection}
  //                 endIcon={<KeyboardArrowDownIcon />}
  //                 variant="contained"
  //                 size="medium"
  //                 fullWidth
  //               >
  //                 {renderSortButtonTitle()}
  //                 <SortIcon />
  //               </Button>
  //             </Grid>

  //             <Grid item xs={6}>
  //               <Button
  //                 onClick={clickToOpenFilterSelection}
  //                 endIcon={<KeyboardArrowDownIcon />}
  //                 variant="contained"
  //                 size="medium"
  //                 fullWidth
  //               >
  //                 <div>فیلترها</div>
  //                 <TuneIcon />
  //               </Button>
  //             </Grid>

  //             {renderDepartmentWorkers()}
  //           </Grid>
  //         </Box>
  //       </Grid>
  //     );
  //   } else if (value == "agents") {
  //     return (
  //       <Grid item xs={12}>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Grid container spacing={1}>
  //             {renderDepartmentColleaguesSortButtons()}
  //             {renderDepartmentColleagues()}
  //           </Grid>
  //         </Box>
  //       </Grid>
  //     );
  //   } else if (value == "jountrequest") {
  //     return (
  //       <Grid item xs={12}>
  //         <Box sx={{ flexGrow: 1 }}>
  //           <Grid container spacing={1}>
  //             {renderDepartmentAgentsWaitingTabContent()}
  //           </Grid>
  //         </Box>
  //       </Grid>
  //     );
  //   }
  // };

  const renderTabs = () => {
    // return (
    //   <Box sx={{ width: "100%" }}>
    //     <Tabs
    //       variant="fullWidth"
    //       value={value}
    //       onChange={handleChange}
    //       textColor="secondary"
    //       indicatorColor="secondary"
    //       aria-label="secondary tabs example"
    //     >
    //       <Tab
    //         value="files"
    //         label={
    //           <p style={{ fontSize: 13 }}>
    //             {"فایل ها"} {"("}
    //             {total_department_workers}
    //             {")"}
    //           </p>
    //         }
    //       />
    //       <Tab
    //         value="agents"
    //         label={
    //           <p style={{ fontSize: 13 }}>
    //             {"مشاورین"} {"("} {department_colleagues.length} {")"}
    //           </p>
    //         }
    //       />

    //       {(role == "رییس" || role == "مدیر") &&
    //         department_waited_colleagues.length > 0 && (
    //           <Tab
    //             value="jountrequest"
    //             label={
    //               <p style={{ fontSize: 13 }}>
    //                 {"درخواست "} {"("} {department_waited_colleagues.length}{" "}
    //                 {")"}
    //               </p>
    //             }
    //           />
    //         )}
    //     </Tabs>
    //   </Box>
    // );

    if (1) {
      return (
        <Tabs
          id="controlled-tab-example"
          fill
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab
            eventKey="files"
            title={
              <p style={{ fontSize: 14 }}>
                {"فایل ها"} {"("}
                {total_department_workers}
                {")"}
              </p>
            }
            className={Styles["personal-tab"]}
          >
            <Grid item xs={12}>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {/* {renderDepartmentWorkers()} */}
                  {renderDepartmentWorkersTabContent()}
                </Grid>
              </Box>
            </Grid>
          </Tab>

          <Tab
            eventKey="agents"
            title={
              <p style={{ fontSize: 14 }}>
                {"مشاورین"} {"("} {department_colleagues.length} {")"}
              </p>
            }
            className={Styles["personal-tab"]}
          >
            <div>
              <Grid item xs={12}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={1}>
                    {/* {renderDepartmentColleagues()} */}
                    {renderDepartmentAgentsTabContent()}
                    {/* {renderTabContent()} */}
                  </Grid>
                </Box>
              </Grid>
            </div>
          </Tab>



          {
            (department_waited_colleagues.length > 0 && (role == "رییس" || role == 'مدیر')) &&
            <Tab
              eventKey="jountrequest"
              title={
                <p style={{ fontSize: 15 }}>
                  <CircleIcon style={{ color: 'red', fontSize: '12px' }} />  {"درخواست "}

                </p>
              }
              className={Styles["personal-tab"]}
            >
              <div>
                <Grid item xs={12}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                      {renderDepartmentAgentsWaitingTabContent()}
                    </Grid>
                  </Box>
                </Grid>
              </div>
            </Tab>
          }
        </Tabs>
      );
    }
  };

  const renderhowmanydaylisted = (day) => {

    if (day == 0) {
      return 'امروز'
    } else {
      return day + ' روز پیش '
    }
  }

  const renderListedByBox = (worker) => {
    var listed_colleague = department_colleagues.filter((x) => {
      // return x.phone === worker.cellphone;
      return x.id == worker.user_id;

      // return x.phone === worker.cellphone;
    });

    // set_properties((filtered[0].low = 0));

    var cl = listed_colleague[0];

    if (cl) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",

            padding: "1px 5px",
            margin: "0px 8px",
            background: "white",

          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <p style={{ fontSize: "10px", padding: "1px 10px" }}>
              <Button
                style={{ marginTop: 5 }}
                variant="outlined"
                href={`tel:${cl && cl.phone}`}
                startIcon={
                  <CallIcon style={{ color: "green", fontSize: "12px" }} />
                }
              >
                تماس
              </Button>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontSize: 14,

            }}
          >
            <Link href={`/realestates/${cl.id}?slug=${cl.name}`}>
              <p style={{ marginTop: 12 }}>
                {cl.name} {cl.family} ({renderhowmanydaylisted(worker.total_day)} )
              </p>
            </Link>
            <p style={{ marginTop: 12 }}>
              {" "}
              {":"} {" لیست شده توسط "}{" "}
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "10px 15px",
            margin: "5px 6px",
            background: "white",
          }}
        >
          <p>دپارتمان</p>
          <p>لیست شده توسط </p>
        </div>
      );
    }
  };

  const renderDepartmentWorkers = () => {

    return(
      <LazyLoader
                items={department_workers}
                itemsPerPage={8}
                delay={800}
                renderItem={(worker,key) => (
                  <Grid item md={4} xs={12} key={worker.id}>
        {/* <WorkerCard key={worker.id} worker={worker} /> */}
        <DepartmentWorkerCard key={worker.id} worker={worker} priority={key < 4} />
        {renderListedByBox(worker)}
        {/* <WorkerCard key={worker.id} worker={worker} /> */}
      </Grid>
                )}
                loadingComponent={
                  <p style={{ textAlign: "center" }}>در حال بارگذاری...</p>
                }
                endComponent={
                  <p style={{ textAlign: "center" }}>همه فایل‌ها بارگذاری شدند✅</p>
                }
                grid={true}
                gridProps={{ spacing: 3 }}
              />
    )
  
  };

  const onclickSortAgent = (filter) => {
    var orginal_department_colleagues = department_colleagues;

    if (filter.english == "more_recents") {
      var sorted_department_colleagues = orginal_department_colleagues
        .sort((a, b) => {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .reverse();

      set_department_colleagues(sorted_department_colleagues);
    } else if (filter.english == "more_views") {
      var sorted_department_colleagues = orginal_department_colleagues.sort(
        (a, b) => b.total_view - a.total_view
      );

      set_department_colleagues(sorted_department_colleagues);
    } else if (filter.english == "more_files") {
      var sorted_department_colleagues = orginal_department_colleagues.sort(
        (a, b) => b.worker_amount - a.worker_amount
      );

      set_department_colleagues(sorted_department_colleagues);
    }

    setSortKey(filter.english);
  };

  const renderDepartmentColleaguesSortButtons = () => {
    return sortAgentsFilters.map((filter) =>
      filter.english == sortKey ? (
        <Grid item md={4} xs={4} key={filter.id}>
          <p
            style={{
              borderBottom: "1px solid purple",
              paddingBottom: 3,
              cursor: "pointer",
            }}
          >
            {filter.name}{" "}
          </p>
        </Grid>
      ) : (
        <Grid
          item
          md={4}
          xs={4}
          key={filter.id}
          onClick={() => onclickSortAgent(filter)}
        >
          <p style={{ cursor: "pointer" }}>{filter.name}</p>
        </Grid>
      )
    );
  };

  const renderDepartmentColleagues = () => {
    return department_colleagues.map(
      (realstate) =>
        realstate.status == 1 && (
          <Grid
            item
            md={4}
            xs={12}
            key={realstate.id}

            // style={{'box-shadow': 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}
            style={{ 'box-shadow': 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px' }}
            className={` animate__animated animate__flipInY    `}
          >
            <RealStateInDepartmentCard
              department={department}
              key={realstate.user_id}
              realstate={realstate}
            />
          </Grid>
        )
    );
  };

  const renderDepartmentWaitedColleagues = () => {
    return department_waited_colleagues.map((realstate) => (
      <Grid item md={6} xs={12} key={realstate.id}>
        <RealStateInDepartmentCard
          department={department}
          key={realstate.id}
          realstate={realstate}
        />
      </Grid>
    ));
  };

  const onPressingSingleNeighborCheckbox = (neighbor) => {
    set_selected_neighborhoods([...selected_neighborhoods, neighbor]);
    set_selected_neighborhoods_array([
      ...selected_neighborhoods_array,
      neighbor.id,
    ]);

    // set_workers(all_workers.filter((item) => item.category_id == cat.id));
  };

  const onDeletingingSingleNeighborCheckbox = (neighbor) => {
    set_selected_neighborhoods(
      selected_neighborhoods.filter((item) => item.id !== neighbor.id)
    );

    set_selected_neighborhoods_array(
      selected_neighborhoods_array.filter((item) => item !== neighbor.id)
    );
  };

  const DepartmentInviteLinkCopyClick = () => {
    console.log("realestateMarketingLinkClick toched");
    copyToClipBoard(
      "https://ajur.app/department/" +
      department.id +
      "?invite_from=" +
      user_from.phone
    );
  };

  const copyToClipBoard = async (copyMe) => {
    const permissions = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (permissions.state === "granted" || permissions.state === "prompt") {
      try {
        await navigator.clipboard.writeText(copyMe);
        setCopySuccess("Copied!");
        console.log("copied fine");
        setProblem("لینک با موفقیت کپی شد");
        set_open_snak(true);
      } catch (err) {
        alert("SOMETHING WRONG" + copyMe);
        setCopySuccess("Failed to copy!");
        console.log("have some copy problem");
      }
    } else {
      alert(
        "مرورگر شما اجازه دسترسی به کلیپ بورد را نمیدهد" +
        "\n" +
        "لطفا متن لینک را به صورت دستی انتخاب و کپی کنید"
      );
    }
  };

  const renderSortDefaultValue = () => {
    if (sortKey == "more_recents") {
      return "more_recents";
    } else if (sortKey == "more_viewd") {
      return "more_viewd";
    } else if (sortKey == "more_updated") {
      return "more_updated";
    }
  };

  const onClickOpenCategorySelection = () => {
    set_filter_level("category");
  };

  const onClickOpenRegionSelection = () => {
    set_filter_level("region");
  };

  const onClickSingleCategory = (cat) => {
    set_filter_selected_category_name(cat.name);
    set_selectedcat(cat.id);
    set_filter_level("base");
    // alert(cat.name);
  };

  const renderFilterSectionPages = () => {
    if (filter_level == "base") {
      return (
        <>
          {renderCategorySelectionBar()}

          {renderRegionSelectionBar()}
        </>
      );
    } else if (filter_level == "category") {
      return subcategories.map((cat) => (
        <Grid item xs={12} sm={6} onClick={() => onClickSingleCategory(cat)}>
          <div className={Styles.new_single_type_wrapper}>
            <div className={Styles.single_icon}>
              <p>
                {filter_selected_category_name == cat.name ? (


                  < RadioButtonCheckedIcon />
                ) : (


                  <RadioButtonUncheckedIcon />
                )}
              </p>
            </div>
            <div className={Styles.single_info}>
              <p>{cat.name}</p>
            </div>
          </div>
        </Grid>
      ));
    } else if (filter_level == "region") {
      return (
        <Grid container spacing={2} style={{ padding: 20 }}>
          {neighborhoods.map((neighbor) => renderOnOffNeighborhoods(neighbor))}
        </Grid>
      );
    }
  };

  const renderOnOffNeighborhoods = (neighbor) => {
    const x = selected_neighborhoods.find(function (item) {
      return item.id == neighbor.id;
    });
    if (x) {
      return (
        <Grid item xs={12} md={6}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<CheckBoxIcon />}
            onClick={() => onDeletingingSingleNeighborCheckbox(neighbor)}
            style={{
              textAlign: "right",
              justifyContent: "space-between",
            }}
          >
            <p>{neighbor.name}</p>
          </Button>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} md={6} spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CheckBoxOutlineBlankIcon />}
            onClick={() => onPressingSingleNeighborCheckbox(neighbor)}
            style={{
              textAlign: "right",
              justifyContent: "space-between",
            }}
          >
            <p>{neighbor.name}</p>
          </Button>
        </Grid>
      );
    }
  };

  const renderSelectedNeighborHoodName = () => {
    return (
      <>
        {selected_neighborhoods.map((nb, index) => (
          <strong> {nb.name} </strong>
        ))}
      </>
    );
  };

  const renderRegionSelectionBar = () => {
    if (selected_neighborhoods.length == 0) {
      return (
        <>
          <div className={Styles["modal-filter-bar-wrapper"]}>
            <p
              onClick={onClickOpenRegionSelection}
              className={Styles["modal-filter-bar-wrapper-button"]}
            >
              انتخاب
            </p>
            <p>انتخاب محلات</p>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={Styles["modal-filter-bar-wrapper"]}>
            <p
              onClick={onClickOpenRegionSelection}
              className={Styles["modal-filter-bar-wrapper-button"]}
            >
              تغییر
            </p>

            <p>
              {" محلات "}
              {renderSelectedNeighborHoodName()}
            </p>
          </div>
          <Divider
            sx={{
              borderBottomWidth: 2,
              background: "#555",
              margin: 1,
            }}
          />
        </>
      );
    }
  };

  const renderCategorySelectionBar = () => {
    if (!filter_selected_category_name) {
      return (
        <>
          <div className={Styles["modal-filter-bar-wrapper"]}>
            <p
              onClick={onClickOpenCategorySelection}
              className={Styles["modal-filter-bar-wrapper-button"]}
            >
              انتخاب
            </p>
            <p>انتخاب دسته بندی</p>
          </div>
          <Divider
            sx={{
              borderBottomWidth: 1,
              background: "#555",
              margin: 1,
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <div className={Styles["modal-filter-bar-wrapper"]}>
            <p
              onClick={onClickOpenCategorySelection}
              className={Styles["modal-filter-bar-wrapper-button"]}
            >
              تغییر
            </p>
            <p>
              {"دسته بندی"} {filter_selected_category_name}{" "}
            </p>
          </div>
          <Divider
            sx={{
              borderBottomWidth: 2,
              background: "#555",
              margin: 1,
            }}
          />
        </>
      );
    }
  };

  const rednerModalContents = () => {
    if (loading) {
      return <SpinnerModalLoader />;
    }

    if (modal_kind == "new_user") {
      return (
        <div>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12} style={{ textAlign: "center", padding: '20px' }}>
              <div>
                <p>مشاور جدید باید بارکد زیر را اسکن کند </p>
                <div style={{ padding: 10 }}>
                  <QrCodeGenerator
                    url={
                      "https://ajur.app/department/" +
                      department.id +
                      "?invite_from=" +
                      user_from.phone
                    }
                    title="اسکن کنید"
                  />
                </div>
              </div>

              <div>
                <p style={{ fontSize: 14, textAlign: "center" }}>
                  یا لینک عضویت را توسط دکمه های زیر برای مشاور ارسال کنید
                </p>
                <Share
                  link={
                    "https://ajur.app/department/" +
                    department.id +
                    "?invite_from=" +
                    user_from.phone
                  }
                />

                <FormControl sx={{ m: 1, width: "100%" }} variant="outlined">
                  <OutlinedInput
                    value={
                      "https://ajur.app/department/" +
                      department.id +
                      "?invite_from=" +
                      user_from.phone
                    }
                    readOnly
                    style={{ fontSize: 14 }}
                    id="outlined-adornment-weight"
                    endAdornment={
                      <InputAdornment position="end">
                        <ContentCopyIcon
                          onClick={DepartmentInviteLinkCopyClick}
                        />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={12} style={{ textAlign: "right", padding: '20px', background: 'white', fontSize: 14 }} >
              <p>
                مشاور جدید بعد از ارسال درخواست باید توسط رییس یا مدیر دپارتمان
                تایید شود{" "}
              </p>
              <p>
                مشاور بعد از تایید با سمت مشاور فعال خواهد شد . که بعدا توسط
                مدیر یا رییس میتواند این سمت تغییر کند
              </p>
              <p>
                مشاور بعد از تایید به فایل ها و مشاورین فعال دپارتمان دسترسی
                خواهد داشت
              </p>
            </Grid>
          </Grid>
        </div>
      );
    } else if (modal_kind == "sort") {
      return (
        <div>
          <Grid
            container
            md={12}
            xs={12}
            style={{
              justifyContent: "right",
              textAlign: "right",
              padding: "10px 20px",
            }}
          >
            <FormControl>
              {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={renderSortDefaultValue()}
                name="radio-buttons-group"
                onChange={handleSortChange}
              >
                <FormControlLabel
                  value="more_recents"
                  control={<Radio />}
                  label="جدیدترین"
                  labelPlacement="start"
                />

                <FormControlLabel
                  value="more_updated"
                  control={<Radio />}
                  label="جدیدترین بروز رسانی"
                  labelPlacement="start"
                />
                <FormControlLabel
                  value="more_viewd"
                  control={<Radio />}
                  label="بیشترین بازدید"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </div>
      );
    } else if (modal_kind == "filter") {
      return (
        <div>
          <Grid
            container
            md={12}
            xs={12}
            style={{
              justifyContent: "right",
              textAlign: "right",
              padding: "10px 20px",
            }}
          >
            {renderFilterSectionPages()}

            {renderFiltersBasedOnCategorySelected()}
            {renderFilterActionButtons()}
          </Grid>
        </div>
      );
    } else if (modal_kind == "search") {
      return <p>search section</p>;
    }
  };

  const onClickFinishFitering = () => {
    setOpen(false);
  };

  const onClickResetNeighborhoodsForm = () => {
    set_selected_neighborhoods([]);
    set_selected_neighborhoods_array([]);
  };

  const onClickCheckAllNeighborhoodsForm = () => {
    set_selected_neighborhoods(neighborhoods);

    set_department_workers(all_department_workers);
    neighborhoods.map((nb) => {
      // set_selected_neighborhoods([
      //   ...selected_neighborhoods,
      //   nb.id,
      // ]);
    });
  };

  const onClickConfirmFilteringNeighborhoods = () => {
    set_filter_level("base");
  };

  const renderFilterActionButtons = () => {
    if (filter_level == "base") {
      return (
        <AppBar
          position="sticky"
          color="primary"
          sx={{ bottom: 0, textAlign: "center" }}
        >
          <p
            onClick={onClickFinishFitering}
            style={{ cursor: "pointer", direction: "rtl" }}
          >
            {" "}
            {"تایید و نمایش"} ({department_workers.length + "  فایل  "} ){" "}
          </p>
        </AppBar>
      );
    } else if (filter_level == "region") {
      return (
        <AppBar
          position="sticky"
          color="primary"
          sx={{ bottom: 0, textAlign: "center" }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {selected_neighborhoods.length > 0 ? (
              <Button
                size="large"
                variant="text"
                style={{
                  fontSize: 13,
                  paddingRight: 30,
                  background: "white",
                  color: "black",
                  marginRight: 10,
                  textAlign: "center",
                  width: "50%",
                }}
                onClick={onClickResetNeighborhoodsForm}
              >
                پاک کردن انتخاب ها
              </Button>
            ) : (
              <Button
                size="large"
                fullWidth
                variant="text"
                style={{
                  color: "black",

                  textAlign: "center",
                }}
                onClick={onClickCheckAllNeighborhoodsForm}
              >
                همه مناطق
              </Button>
            )}

            {selected_neighborhoods.length > 0 ? (
              <Button
                size="large"
                style={{ color: "white", width: "50%" }}
                variant="contained"
                onClick={onClickConfirmFilteringNeighborhoods}
              >
                {"تایید "} ({department_workers.length + "  فایل  "} ){" "}
              </Button>
            ) : null}
          </div>
        </AppBar>
      );
    }
  };

  const onDeleteSingleTickFieldCheckbox = (fl) => {
    alert("plese uncheek :" + fl.value);
    // set_selected_neighborhoods(
    //   selected_neighborhoods.filter((item) => item.id !== neighbor.id)
    // );

    // set_selected_neighborhoods_array(
    //   selected_neighborhoods_array.filter((item) => item !== neighbor.id)
    // );
  };

  const onPressingSingleTickFieldCheckbox = (fl) => {

    // alert('fl is expected to be fill right now ' + fl.value);
    let prop = {
      name: fl.value,
      value: 1,
      kind: 2,
      special: fl.special,
      order: fl.sort,
    };

    set_tick_properties([...tick_properties, prop]);


  };

  const onDeletingSingleTickFieldCheckbox = (fl) => {
    set_tick_properties(tick_properties.filter((item) => item.name !== fl.value));
  };

  const renderCheckboxForTickField = (fl) => {
    if (1) {
      return (


        <CheckBoxOutlineBlankIcon />
        // fl.ticked ?  <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon/>

      )
    }
  }

  const renderOnOff = (fl) => {





    const x = tick_properties.find(function (item) {
      return item.name == fl.value;
    });
    if (x) {

      return (
        <div
          style={{ width: "100%" }}
          onClick={() => onDeletingSingleTickFieldCheckbox(fl)}
        >
          <p
            style={{
              // direction: "rtl",
              textAlign: "right",
              marginRight: 10,
              color: "#555",
              fontSize: 14,
              padding: "5px 5px",

              marginLeft: 2,
              width: "100%",
            }}
          >
            دارای <strong> {fl.value}</strong> باشد
            {/* <CheckBoxIcon />  */}
            {/* { renderCheckboxForTickField(fl) }  */}
            <CheckBoxIcon />

          </p>

          <Divider
            sx={{
              borderBottomWidth: 1,
              background: "#555",
              margin: 1,
            }}
          // fullWidth
          />
        </div>
      );





    } else {

      return (
        <div
          style={{ width: "100%" }}
          onClick={() => onPressingSingleTickFieldCheckbox(fl)}
        >
          <p
            style={{
              // direction: "rtl",
              textAlign: "right",
              marginRight: 10,
              color: "#555",
              fontSize: 14,
              padding: "5px 5px",

              marginLeft: 2,
              width: "100%",
            }}
          >
            دارای <strong> {fl.value}</strong> باشد
            {/* <CheckBoxIcon />  */}
            {/* { renderCheckboxForTickField(fl) }  */}
            <CheckBoxOutlineBlankIcon />

          </p>

          <Divider
            sx={{
              borderBottomWidth: 1,
              background: "#555",
              margin: 1,
            }}
          // fullWidth
          />
        </div>

      )


    }




  }

  const renderFiltersBasedOnCategorySelected = () => {
    if (filter_level == "base") {
      return (
        <>
          {/* tick_fields filter loop here _this is a new feature */}

          {tick_fields.map(
            (fl, index) =>
              fl.special == 1 && (
                renderOnOff(fl)
              )
          )}

          {/* end of tick fields filter loop */}
          {normal_fields.map(
            (fl, index) =>
              fl.special == 1 && (
                <div style={{ width: "100%" }}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      {(fl.low > 0 || fl.high > 0) && (
                        <p
                          style={{
                            width: "100%",
                            fontSize: 12,
                            direction: "rtl",
                            textAlign: "right",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteFlFilter(fl)}
                          >
                            حذف
                          </Button>{" "}
                          {fl.low > 0 && numFormatter(fl.low)}{" "}
                          {fl.high > 0 && fl.high != fl.max_range && "تا"}{" "}
                          {fl.low > 0 &&
                            (fl.high == fl.max_range || fl.high == 0) &&
                            "به بالا"}{" "}
                          {fl.high > 0 &&
                            fl.high != fl.max_range &&
                            numFormatter(fl.high)}
                        </p>
                      )}

                      <p
                        style={{
                          // direction: "rtl",
                          textAlign: "right",
                          marginRight: 10,
                          color: "#555",
                          fontSize: 14,
                          padding: "5px 5px",

                          marginLeft: 2,
                          width: "100%",
                        }}
                      >
                        {fl.value}
                      </p>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div style={{ padding: "1px 10px" }}>
                        <Slider
                          getAriaLabel={() => "Minimum distance"}
                          // value={[handleMinValueForSlider(fl), handleMaxValueForSlider(fl)]}
                          value={[
                            fl.low > 0
                              ? parseInt(fl.low)
                              : parseInt(fl.min_range),
                            fl.high > 0
                              ? parseInt(fl.high)
                              : parseInt(fl.max_range),
                          ]}
                          onChange={(event, newValue, activeThumb) =>
                            handleChangeSliderValue(
                              event,
                              newValue,
                              activeThumb,
                              fl,
                              index
                            )
                          }
                          valueLabelFormat={numFormatter}
                          valueLabelDisplay="auto"
                          aria-labelledby="non-linear-slider"
                          getAriaValueText={valuetext}
                          // disableSwap
                          // step={calculateSteps(fl)}

                          min={parseInt(fl.min_range)}
                          max={parseInt(fl.max_range)}
                        // min={0}
                        // max={500}
                        />
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Divider
                    sx={{
                      borderBottomWidth: 1,
                      background: "#555",
                      margin: 1,
                    }}
                  // fullWidth
                  />
                </div>
              )
          )}
        </>
      );
    }
  };

  const renderFilterSearchBasedOnLevel = () => {
    if (filter_level == "base") {
      return <strong style={{ color: "#666" }}>فیلتر ها </strong>;
    } else if (filter_level == "category") {
      return <strong style={{ color: "#666" }}>انتخاب دسته بندی</strong>;
    } else if (filter_level == "region") {
      return <strong style={{ color: "#666" }}>انتخاب محلات</strong>;
    }
  };

  const onResetAllFilters = () => {
    alert("all filter must reset now ");
    return;

    set_filter_level("base");
    setOpen(false);
  };

  const renderModalTitle = () => {
    if (modal_kind == "sort") {
      return (
        <p
          className={Styles["modal-header-title"]}
          style={{ textAlign: "right" }}
        >
          مرتب سازی بر اساس
        </p>
      );
    } else if (modal_kind == "filter") {
      return (
        <p
          className={Styles["modal-header-title"]}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {renderFilterSearchBasedOnLevel()}
          <strong
            onClick={onResetAllFilters}
            style={{ color: "#0072ff", cursor: "pointer", fontSize: 14 }}
          >
            حذف فیلترها
          </strong>
        </p>
      );
    } else if (modal_kind == "search") {
      return (
        <p className={Styles["modal-header-title"]}>search in everything</p>
      );
    }
  };

  const renderModal = () => {
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {/* <Box sx={style} className={Styles['modal_wrapper']}> */}
        <Box className={Styles["modal_wrapper"]}>
          {/* {renderModalContent()} */}

          <AppBar
            position="sticky"
            color="primary"
            sx={{ top: 0, bottom: "auto" }}
          >
            <div className={Styles["modal-header"]}>
              <Paper elevation={3} sx={{ background: "white" }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item md={2} xs={2}>
                      {/* <CloseIcon  className={Styles['modal-header-close-button']}/> */}
                      <Button onClick={handleClose} variant="text">
                        <CloseIcon
                          className={Styles["modal-header-close-button"]}
                        />
                      </Button>
                    </Grid>
                    <Grid item md={10} xs={10}>
                      {renderModalTitle()}
                    </Grid>

                    {/* {department_workers.length} */}
                  </Grid>
                </Box>
              </Paper>
            </div>
          </AppBar>

          {rednerModalContents()}
        </Box>
      </Modal>
    );
  };

  useEffect(() => {
    var token = Cookies.get("id_token");
    axios({
      method: "get",
      url: "https://api.ajur.app/api/get-department",
      params: {
        token: token,
      },
    }).then(function (response) {
      console.log(
        "--- the data fetched from get-department in panel is ----------"
      );
      console.log(response.data);

      set_user(response.data.user);
      set_department(response.data.department);

      // alert(response.data.department.name);
      set_total_department_workers(response.data.total_department_workers);
      set_department_workers(response.data.department_workers);
      set_all_department_workers(response.data.department_workers);

      set_department_colleagues(response.data.colleagues);
      set_subcategories(response.data.subcategories);
      set_neighborhoods(response.data.neighborhoods);

      console.log(
        "-----------0-00-0-0----- the subcategories returned from axios is ---------0-0"
      );
      console.log(response.data.subcategories);

      const colleagues = (response.data && response.data.colleagues) ? response.data.colleagues : [];

      var selected_normal_field = colleagues.filter((cl) => {
        return (cl && (cl.status == 0 || cl.stauts == 0));
      });

      set_department_waited_colleagues(
        colleagues.filter((item) => item && (item.status == 0 || item.stauts == 0))
      );

      set_loading(false);
    });
  }, []);

  if (loading) {
    return <SpinnerLoader />;
  } else {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item md={2} xs={0}></Grid>

          <Grid item md={8} xs={12}>
            <div className={Styles["new-wrapper"]}>
              {(role == "رییس" || role == "مدیر") && (
                <SpeedDial
                  ariaLabel="مشاور جدید"
                  sx={{ position: "fixed", bottom: 150, right: 16 }}
                  icon={<PersonAddIcon />}
                  onClick={renderNewAgentModal}
                  FabProps={{
                    sx: {
                      bgcolor: '#b92a31',
                      '&:hover': {
                        bgcolor: 'primary.main',
                      }
                    }
                  }}
                ></SpeedDial>
              )}

              {role == "رییس" && (
                <Button
                  onClick={goToEditDepartment}
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                >
                  ویرایش دپارتمان
                </Button>
              )}
            </div>
          </Grid>

          <Grid item md={2} xs={0}></Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item md={2} xs={0}></Grid>
          <Grid
            className={` animate__animated animate__zoomIn   `}
            item
            md={8}
            xs={12}
          >
            {/* {renderSearchButton()} */}
          </Grid>
          <Grid item md={2} xs={0}></Grid>



          <Grid item md={12} xs={12}>
            {renderTabs()}
            {/* <div style={{ marginTop: 16 }}>{renderTabContent()}</div> */}
          </Grid>


          {renderModal()}

          <Snackbar
            open={open_snak}
            autoHideDuration={6000}
            onClose={handleCloseSnak}
          >
            <Alert
              onClose={handleCloseSnak}
              severity="success"
              sx={{ width: "100%" }}
            >
              {problem}
            </Alert>
          </Snackbar>
        </Grid>
      </>
    );
  }
};

export default DepartmentPanel;
