import { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Button,Stack,Box,TextField,Dialog,DialogTitle,DialogContent,DialogActions,Grid,DialogContentText,IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import UpdateIcon from '@mui/icons-material/Update';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Tooltip } from "@mui/material";
////

import { ProvInfoUse } from '../context/ContextData';
// ------------------
// import CollectionDate from "../utils/CollectionDate"
// import CheckMoney from '../utils/CollectionOwed';
import utilsFuncs from "../utils";

//-------------------
// import splitDateTime from '../utils/DateSplit';
import "../assets/MD_Kashf.css"
import {updatePatient as UP,getPatients,deletePatient} from "../firebase/Firebase.config"
import EditLogic from '../utils/Logic/Edit Search'; /*Edit Logic*/
import ExitLogic from '../utils/Logic/Exit Search'; /*Exit Logic*/
import DellLogic from '../utils/Logic/Dell Search'; /*Dell Logic*/
const splitDateTime = (datetimeStr) => {
    const [date] = datetimeStr.split('T');
    return { date };
};
function splitDateTime2(str) {
  if (!str) return { date: null, time: null }; // إذا كانت null أو undefined أو فارغة

  const [date, time] = str.split("T"); // تقسيم التاريخ والوقت
  return { date, time };
}
export default function Search() {
    const {CollectionDate,CheckMoney}=utilsFuncs()
    const { patient, setPatient } = ProvInfoUse();
    const [tm,setTM] = useState("nnnnnnnnnll")
    const [value, setValue] = useState(null);

    const [filtredDate,setFiltredDate]=useState({start:'',end:''})
    //   const [applyFilter, setApplyFilter] = useState(false); // للتحكم بالزر Search
    //   const [searchClicked, setSearchClicked] = useState(false); // لتنفيذ الفلترة عند الضغط فقط
    const fetchData = async () => {
            try{
                // console.log("try")
                let db = await getPatients();
                // let db = JSON.parse(localStorage.getItem("Patient")) ?? []
                const UpdatedDate = db.map((e) => {
                    const numberDays = CollectionDate(e.EnteryData.EntryTime, e.ExitData.ExitTime);
                    const amountOwed = CheckMoney(numberDays, e.FinancialData.AmountPaid); // مرر البيانات المطلوبة

                return {...e,FinancialData: {...e.FinancialData,NumberDays: numberDays,AmountOwed: amountOwed,},};
                });
                setPatient(UpdatedDate)
                localStorage.setItem("Patient", JSON.stringify(UpdatedDate))
            }
            catch(error){
                console.log("err:"+error)
                let db = JSON.parse(localStorage.getItem("Patient")) ?? []
                const UpdatedDate = db.map((e) => {
                    const numberDays = CollectionDate(e.EnteryData.EntryTime, e.ExitData.ExitTime);
                    const amountOwed = CheckMoney(numberDays, e.FinancialData.AmountPaid); // مرر البيانات المطلوبة

                return {...e,FinancialData: {...e.FinancialData,NumberDays: numberDays,AmountOwed: amountOwed,},};
                });
                setPatient(UpdatedDate)
                localStorage.setItem("Patient", JSON.stringify(UpdatedDate))
            }
        }
    // --------------------------------------------------
    useEffect(()=>{
        setTM(new Date().toLocaleDateString());
    },[])
    useEffect(()=>{
        fetchData()
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
// ----------------------- Start=> Search Logic-----------------------
const [searchTerm, setSearchTerm] = useState('');
const [selected, setSelected] = useState(''); // قيمها ستكون: "In" أو "Out" أو فارغة (All)

//
 const filteredPatients = useMemo(() => {
    return patient.filter((p) => {
      // البحث بالاسم
      const matchName = p.PersonalData.Name.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

      // فلترة الحالة
      const matchCondition =
        selected === ""
          ? true
          : p.EnteryData.Condition.toLowerCase().includes(
              selected.toLowerCase()
            );

      // فلترة بالتاريخ
      if (filtredDate.start && filtredDate.end) {
        // ✅ EntryTime بصيغة ISO (صالح لـ new Date)
        const entryDate = new Date(p.EnteryData.EntryTime);
        const startDate = new Date(filtredDate.start);
        const endDate = new Date(filtredDate.end);

        // إزالة الوقت للمقارنة الصحيحة
        entryDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const matchDate = entryDate >= startDate && entryDate <= endDate;
        return matchName && matchCondition && matchDate;
      }

      return matchName && matchCondition;
    });
  }, [patient, searchTerm, selected, filtredDate]);
//
// const filteredPatients = useMemo(() => {
//     return patient.filter((p) => {
//       // فلترة الاسم
//         const matchName = p.PersonalData.Name.toLowerCase().includes(searchTerm.toLowerCase());
//       // فلترة الحالة
//         const matchCondition = selected === "" ? true : p.EnteryData.Condition.toLowerCase().includes( selected.toLowerCase());

//       // فلترة التاريخ (تعمل فقط بعد الضغط على الزر)
//         if (searchClicked && filtredDate.start && filtredDate.end) {
//             const entryDate = new Date(p.EnteryData.Date); // تاريخ دخول المريض مثلًا
//             const startDate = new Date(filtredDate.start);
//             const endDate = new Date(filtredDate.end);

//             // نزيل الوقت لتكون المقارنة صحيحة
//             entryDate.setHours(0, 0, 0, 0);
//             startDate.setHours(0, 0, 0, 0);
//             endDate.setHours(23, 59, 59, 999);

//             const matchDate = entryDate >= startDate && entryDate <= endDate;
//             return matchName && matchCondition && matchDate;
//         }

//       // في حال لم يتم الضغط على الزر
//         return matchName && matchCondition;
//     });
//     }, [patient, searchTerm, selected, filtredDate, searchClicked]);
//
// const filteredPatients = useMemo(() => {
//     return patient.filter((p) => {
//         const matchName = p.PersonalData.Name.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchCondition =
//         selected === '' // All
//             ? true
//             : p.EnteryData.Condition.toLowerCase().includes(selected.toLowerCase());
//         return matchName && matchCondition;
//     });
// }, [patient, searchTerm, selected]);

// const [value,setValue]=useState('')
    // const [searchTerm, setSearchTerm] = useState('');
    // const filteredPatients = useMemo(() => {
    //     return patient.filter((p) =>
    //         p.PersonalData.Name.toLowerCase().includes(searchTerm.toLowerCase())
    //     )}, [patient, searchTerm]);



    // const [selected,setSelected] = useState('');
    // const filtredselected  =  useMemo(() => {
    //     return patient.filter((p) =>
    //         p.EnteryData.Condition.toLowerCase().includes(selected.toLowerCase())
    //     )}, [patient, selected])
// ----------------------- End=> Search Logic-----------------------
//--------------------------------------------------------
// ❌==========================Start=>:(Edit Section)==========================❌//
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const {handleOpenEdit, handleSaveEdit}=EditLogic({ patient, setPatient, selectedPatient, setSelectedPatient, setOpenEdit,UP })
// ❌==========================End✅=>:(Edit Section)==========================❌//

// ❌==========================Start=>:(Exit Section)==========================❌//
    const [selectedPatientExit, setSelectedPatientExit] = useState(null);
    const [openExit, setOpenExit] = useState(false);
    const [openAlert, setopenAlert] = useState(false);
    const handleClickOpen = () => {setopenAlert(true);};
    const {handleOpenExit, handleSaveExit}=ExitLogic({ patient, setPatient, selectedPatientExit, setSelectedPatientExit, UP, handleClickOpen, setOpenExit})
// ❌==========================End✅=>:(Exit Section)==========================❌//

// ❌==========================Start=>:(View Section)==========================❌//
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
    const [openPatientDialog, setOpenPatientDialog] = useState(false);
    const handleOpenPatientDetails = (id) => {
        const found = patient.find(p => p.id === id);
        setSelectedPatientDetails(found);
        setOpenPatientDialog(true);
    };
// ❌==========================End✅=>:(View Section)==========================❌//

// ❌==========================Start=>:(Dell Section)==========================❌//
    const [selectedPatientDelete, setSelectedPatientDelete] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const {handleOpenPatientDelete, confirmDelete}=DellLogic({patient, setPatient, selectedPatientDelete, setSelectedPatientDelete, setOpenDeleteDialog, deletePatient})
// ❌==========================End✅=>:(Dell Section)==========================❌ //

//--------------------------------------------Rows Data--------------------------------------------//

const flatData = useMemo(() => {
    return filteredPatients
        .slice() // نسخة حتى لا نعدل الأصل
        .sort((a, b) => new Date(a.EnteryData.EntryTime) - new Date(b.EnteryData.EntryTime)) // ترتيب حسب الإضافة (الأقدم أول)
        .map((e, index) => {
            const exitDateObj = splitDateTime2(e.ExitData?.ExitTime);
            return{
                
            id: e.id,
            Num: index + 1, // رقم متسلسل مضبوط بعد الترتيب
            EntryTime: splitDateTime(e.EnteryData.EntryTime).date,
            ExitData: exitDateObj.date ? exitDateObj.date : "is here",
            Name: e.PersonalData.Name,
            Address: e.PersonalData.Address,
            NumberDays: e.FinancialData.NumberDays,
            AmountPaid: e.FinancialData.AmountPaid,
            AmountOwed: e.FinancialData.AmountOwed,
            TypeDiseas: e.EnteryData.TypeDiseas,
            Condition: e.EnteryData.Condition,
            FullData: e,
            }
        });
}, [filteredPatients]);

    // const flatData = useMemo(() => {
    //     return filteredPatients.map((e, index) => ({
    //         id: e.id,
    //         Num: index + 1,
    //         EntryTime: splitDateTime(e.EnteryData.EntryTime).date,
    //         Name: e.PersonalData.Name,
    //         Address: e.PersonalData.Address,
    //         NumberDays: e.FinancialData.NumberDays,
    //         AmountPaid: e.FinancialData.AmountPaid,
    //         AmountOwed: e.FinancialData.AmountOwed,
    //         TypeDiseas: e.EnteryData.TypeDiseas,
    //         Condition: e.EnteryData.Condition,
    //         FullData: e, // بيانات إضافية لا تُعرض بالجدول لكنها تُستخدم
    //     }));
    // }, [filteredPatients]);

//--------------------------------------------Columns--------------------------------------------//
function color(num) {
    if (num < 5000) {
        return 'black';
    } else if (num <= 9000 && num >= 5000) {
        return 'red';
    } else {
        return 'blue';
    }
}
// 
let BKcolor='#f8edeb'
let FTcolor='#000'
// 
    const columns = [
        { field: 'Num', headerName: 'م', width: 45 ,
            renderCell: (params) => (<div style={{  textAlign:'right'}}>{params.value}</div>)},
        { field: 'Name', headerName: <BadgeIcon/> /*'الاسم'*/, width: 200 , 
            renderCell: (params) => (<div style={{  textAlign:'right' , backgroundColor:BKcolor ,color:FTcolor,fontWeight:'bold' ,fontSize:'30'}}>{params.value}</div>)},
        { field: 'EntryTime', headerName: <CalendarMonthIcon/> /*'تاريخ الدخول'*/, width: 130 , 
            renderCell: (params) => (<div style={{  textAlign:'right' , backgroundColor:BKcolor ,color:FTcolor }}>{params.value}</div>)},

        // { field:"ExitData" , header:'exit' , width:80,
        //     renderCell:(params)=>(<div style={{color: (params.value === 'is here') ? 'red': 'green'}}>{params.value}</div>)
        // },
        { field: 'NumberDays', headerName: 'عدد الأيام', width: 70 , 
            renderCell: (params) => (<div style={{  textAlign:'center' , backgroundColor:BKcolor}}>{params.value}</div>) },
        { field: 'AmountPaid', headerName: 'المدفوع', width: 90 ,
            renderCell: (params) => (<div style={{  textAlign:'center', backgroundColor:BKcolor}}>{params.value}</div>)},
        { field: 'AmountOwed', headerName: 'المتبقي', width: 90 ,
            renderCell: (params) => (<div style={{  textAlign:'center', backgroundColor:'#fae1dd' , color: color(params.value) }}>{params.value}</div>)},
        { field: 'TypeDiseas', headerName: 'التحاليل', width: 130 ,
            renderCell: (params) => (<div style={{  textAlign:'right', backgroundColor:'#fae1dd',color:FTcolor}}>{params.value}</div>)},
        { field: 'Address', headerName: <HomeIcon/>/*'العنوان'*/, width: 145 ,
            renderCell: (params) => (<div style={{  textAlign:'right', backgroundColor:BKcolor,color:FTcolor}}>{params.value}</div>)},
        { field: 'Condition', headerName: 'الحالة', width: 60 ,
            renderCell: (params) => (<div style={{  textAlign:'center', backgroundColor:BKcolor}}>{params.value}</div>)
        },
        { field: 'actions', headerName: <ListAltIcon/>/*'إجراءات'*/, width: 240,
            
            renderCell: (params) => (
                <Stack direction="row" spacing={1} gap={1}>
                    
                    <IconButton color="primary" size="small" onClick={() => handleOpenEdit(params.row.id)} 
                            sx={{border:'1px solid #1565C0',backgroundColor:'#1565c050'}}>
                        <EditIcon />
                    </IconButton>

                    <IconButton color="success" size="small" onClick={() => handleOpenPatientDetails(params.row.id)}
                            sx={{border:'1px solid #2E7D32',backgroundColor:'#2E7D3250'}}>
                        <DescriptionIcon/>
                    </IconButton>

                    <IconButton color="warning" size="small" onClick={() => handleOpenExit(params.row.id)}
                            sx={{border:'1px solid #ED6C02',backgroundColor:'#ED6C0250'}}>
                        <LogoutIcon/>
                    </IconButton>
                    
                    <IconButton color="error" size="small" onClick={() => handleOpenPatientDelete(params.row.id)}
                            sx={{border:'1px solid #D32F2F',backgroundColor:'#d32f2f50'}}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        },
    ];


    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const d = new Date();
let day = days[d.getDay()];

    return (
        <Box sx={{ width: '100%' }}>

            <Stack spacing={2} sx={{ mb: 2 }}>
                {/* --- القسم العلوي: زر التحديث --- */}
                <Stack direction="row" justifyContent="flex-start" alignItems="center"
                    sx={{gap: 2, backgroundColor: "#f8f9fa",p: 1.5,borderRadius: 3,boxShadow: "0 2px 6px rgba(0,0,0,0.08)"}}>
                    <Tooltip title="تحديث البيانات">
                        <Button onClick={fetchData}
                            sx={{bgcolor: "#2e7d32",color: "#fff",borderRadius: "50%",p: 1.3,minWidth: "48px",
                            "&:hover": {bgcolor: "#1b5e20",transform: "scale(1.05)",transition: "all 0.2s ease",},
                            }}>
                            <UpdateIcon fontSize="medium" />
                        </Button>
                    </Tooltip>
                    <Tooltip title="فلتره ب الحالة">
                        <ButtonGroup variant="outlined" aria-label="filter buttons"
                        sx={{flexDirection:'row-reverse',"& .MuiButton-root": {fontWeight: "bold",px: 3,textTransform: "capitalize"}}}>
                            <Button variant={selected === "in" ? "contained" : "outlined"} color="success" onClick={() => setSelected("in")}>
                                In
                            </Button>
                            <Button variant={selected === "out" ? "contained" : "outlined"} color="error" onClick={() => setSelected("out")}>
                                Out
                            </Button>
                            <Button variant={selected === "" ? "contained" : "outlined"} color="primary" onClick={() => setSelected("")}>
                                All
                            </Button>
                        </ButtonGroup>
                    </Tooltip>

                    {/* نطاق التاريخ */}
                    <Stack direction="row" spacing={2}>
                        <TextField type="date" label="Start Date" value={filtredDate.start}
                        onChange={(e) =>setFiltredDate({ ...filtredDate, start: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{"& .MuiOutlinedInput-root": { borderRadius: 2,},}}/>

                        <TextField type="date" label="End Date" value={filtredDate.end}
                            onChange={(e) =>setFiltredDate({ ...filtredDate, end: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{"& .MuiOutlinedInput-root": {borderRadius: 2,},}}/>
                        <Button variant="outlined" color="warning" onClick={() => setFiltredDate({ ...filtredDate, start: "", end: "" })} 
                        sx={{fontWeight: "bold",textTransform: "capitalize",}}>
                        Reset
                        </Button>
                    </Stack>
                    {/* <Card variant="outlined">{card}</Card> */}
                    <Typography variant="h4" component="div">
                        {tm}{" - "}{day}
                    </Typography>
                </Stack>

                {/* --- القسم السفلي: الفلاتر --- */}
                <Stack
                    direction="row" flexWrap="wrap" alignItems="center" justifyContent="center"
                    sx={{gap: 2,p: 2,backgroundColor: "#ffffff",borderRadius: 3,boxShadow: "0 2px 6px rgba(0,0,0,0.08)",}}>
                    
                    <TextField label="Search" variant="outlined" value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 520, "& .MuiOutlinedInput-root": { borderRadius: 2,},}} />

                    <Button variant="outlined" color="warning" onClick={() => setSearchTerm("")} 
                        sx={{fontWeight: "bold",textTransform: "capitalize",}}>
                        Reset {}
                        Search
                        </Button>
                </Stack>
            </Stack>

            {/*  Datatable  */}
            <DataGrid rows={flatData} columns={columns} pageSize={5} rowsPerPageOptions={[5]} autoHeight 
            // sx={{ direction: 'rtl' ,fontWeight:'bold',backgroundColor:'#f8edeb',fontFamily:'sans-serif'}}
            sx={{
                backgroundColor:'#f8edeb',
                fontFamily: 'Arial, sans-serif', // تغيير الخط العام
                fontSize: '20px',    
                fontWeight: 'bold',            // حجم الخط
                    '& .MuiDataGrid-columnHeaders': {
                            fontFamily: 'Verdana, sans-serif', // خط رؤوس الأعمدة
                            fontWeight: 'bold',
                            fontSize: '16px',
                },
                '& .MuiDataGrid-cell': {
                fontFamily: 'Tahoma, sans-serif', // خط الخلايا
                },
            }}
            />

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
                <DialogContent>
                    <Grid container spacing={2} >
                        {/* البيانات الشخصية */}
                        <Grid item xs={12} sm={6} md={4} >
                            <DialogTitle> بيانات شخصيه</DialogTitle>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField label="الاسم" fullWidth value={selectedPatient?.Name || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Name: e.target.value })}/>

                                <TextField label="العنوان" fullWidth value={selectedPatient?.Address || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Address: e.target.value })}/>

                                <TextField label="رقم القومي" fullWidth value={selectedPatient?.ID || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, ID: e.target.value })}/>

                                <TextField label="النوع" fullWidth value={selectedPatient?.Gender || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Gender: e.target.value })}/>

                                <TextField label="الوظيفه" fullWidth value={selectedPatient?.Work || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Work: e.target.value })}/>

                                <TextField label="السن" fullWidth value={selectedPatient?.Age || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Age: e.target.value })}/>

                                <TextField label="الديانه" fullWidth value={selectedPatient?.Religion || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Religion: e.target.value })}/>

                                <TextField label="الحالة الاجتماعية" fullWidth value={selectedPatient?.SocialStatus || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, SocialStatus: e.target.value })}/>

                                <TextField label="الجنسية" fullWidth value={selectedPatient?.Nationnality || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Nationnality: e.target.value })}/>
                            </Stack>
                        </Grid>
                        {/* صاحب الدخول */}
                        <Grid item xs={12} sm={6} md={4} >
                            <DialogTitle> بيانات صاحب الدخول</DialogTitle>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField label="الاسم" fullWidth value={selectedPatient?.FSName || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSName: e.target.value })}/>

                                <TextField label="العنوان" fullWidth value={selectedPatient?.FSAddress || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSAddress: e.target.value })}/>

                                <TextField label="الرقم القومي" fullWidth value={selectedPatient?.FSID || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSID: e.target.value })}/>

                                <TextField label="الجنسية" fullWidth value={selectedPatient?.FSWork || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSWork: e.target.value })}/>

                                <TextField label="الوظيفه" fullWidth value={selectedPatient?.FSKinship || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSKinship: e.target.value })}/>

                                <TextField label="الصفة" fullWidth value={selectedPatient?.FSNationnality || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSNationnality: e.target.value })}/>

                                <TextField label="رقم التليفون" fullWidth value={selectedPatient?.FSPhoneNumber || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSPhoneNumber: e.target.value })}/>

                                <TextField label="اقرار الجلسات" fullWidth value={selectedPatient?.FSApprovalSession || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, FSApprovalSession: e.target.value })}/>
                            </Stack>
                        </Grid>
                        {/* بيانات الدخول*/}
                        <Grid item xs={12} sm={6} md={4} >
                            <DialogTitle> بيانات الدخول</DialogTitle>
                            <Stack spacing={2} sx={{ mt: 1 }}>
                                <TextField label="ماده الدخول" fullWidth value={selectedPatient?.EntryMaterial || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, EntryMaterial: e.target.value })}/>

                                <TextField  type='date' fullWidth value={selectedPatient?.EntryTime || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, EntryTime: e.target.value })}/>

                                <TextField label="نوع المخدرات" fullWidth value={selectedPatient?.TypeDiseas || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, TypeDiseas: e.target.value })}/>

                                <TextField label="رقم الكود المجلس" fullWidth value={selectedPatient?.CouncilCode || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, CouncilCode: e.target.value })}/>

                                <TextField label="حالة المريض" disabled fullWidth value={selectedPatient?.Condition || ''}
                                onChange={(e) => setSelectedPatient({ ...selectedPatient, Condition: e.target.value })}/>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEdit(false)}>إلغاء</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">حفظ</Button>
                </DialogActions>
            </Dialog>

            {/* Exit Dialog */}
            <Dialog open={openExit} onClose={() => setOpenExit(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField type='date' fullWidth value={selectedPatientExit?.ExitTime || ''}
                            onChange={(e) => setSelectedPatientExit({ ...selectedPatientExit, ExitTime: e.target.value })}/>

                        <TextField label="سبب الخروج" fullWidth value={selectedPatientExit?.ReasonExit || ''}
                            onChange={(e) => setSelectedPatientExit({ ...selectedPatientExit, ReasonExit: e.target.value })}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExit(false)}>Cancel</Button>
                    <Button onClick={handleSaveExit} variant="contained" color="primary">Exit</Button>
                </DialogActions>
            </Dialog>
            {/* Exit Dialog Alert*/}
            <Dialog open={openAlert} onClose={()=>{setopenAlert(false)}}>
                <DialogTitle id="alert-dialog-title">{"Exit!.."}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    هذا المريض قد تم إخراجه بالفعل.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setopenAlert(false)}}>OK</Button>
                </DialogActions>
            </Dialog>
            {/* Show Alert */}
            <Dialog open={openPatientDialog} onClose={() => setOpenPatientDialog(false)} fullWidth>
                <DialogTitle>تفاصيل المريض</DialogTitle>
                <DialogContent>
                    {selectedPatientDetails && (
                    <Box>
                        <div>
                            <div className="patient-grid">
                                <div className="patient-image">
                                    {/* <img src="/الادمان.png" alt="صورة المريض" /> */}
                                    <img src="/Elmanar.jpg" alt="" />
                                </div>

                                <div className="patient-details">
                                    <p><strong>الاسم:</strong> {selectedPatientDetails.PersonalData.Name || "—"}</p>
                                    <p><strong>تاريخ الدخول:</strong> {splitDateTime(selectedPatientDetails.EnteryData.EntryTime).date || "—"}</p>
                                    <p><strong>التحاليل:</strong> {selectedPatientDetails.EnteryData.TypeDiseas || "—"}</p>
                                    <p><strong>رقم المجلس:</strong> {selectedPatientDetails.EnteryData.CouncilCode || "—"}</p>
                                    <h4 style={{ color: 'red' }}>تفاصيل الدفع:</h4>
                                </div>
                            </div>
                            <table style={{width:"100%",border:'1px solid black',borderRadius:'10px',textAlign:'center'}}>
                                <tr>
                                    <th style={{border:'1px solid black'}}>المبلغ المدفوع</th>
                                    <th style={{border:'1px solid black'}}>تاريخ الدفع</th>
                                </tr>
                                {selectedPatientDetails.PaymentsDetails.map((e)=>{
                                    return(
                                        <tr>
                                            <td style={{border:'1px solid black'}}>{e.AmountPaid} </td>
                                            <td style={{border:'1px solid black'}}>{e.PaymentDate}</td>
                                        </tr>
                                    )
                                })}
                                <tr>
                                    <td style={{border:'1px solid black',fontWeight:'bold',backgroundColor:'black',color:'white'}}>المبلغ المدفوع الكلي</td>
                                    <td style={{border:'1px solid black',fontWeight:'bold',backgroundColor:'black',color:'white'}}>المبلغ المتبقي</td>
                                </tr>
                                <tr>
                                    <td style={{border:'1px solid black',color:'green',fontWeight:'bold',backgroundColor: '#bdbfbd'}}>
                                        {selectedPatientDetails.FinancialData.AmountPaid || 0}
                                    </td>
                                    <td style={{border:'1px solid black',color:'red',fontWeight:'bold',backgroundColor: '#bdbfbd'}}>
                                        {selectedPatientDetails.FinancialData.AmountOwed || 0} 
                                    </td>
                                </tr>
                                </table>
                        </div>
                    </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPatientDialog(false)}>إغلاق</Button>
                </DialogActions>
            </Dialog> 
            {/* Show Delete */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    هل أنت متأكد من حذف المريض: {selectedPatientDelete?.PersonalData?.Name}؟
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>إلغاء</Button>
                    <Button onClick={confirmDelete} color="error">تأكيد الحذف</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
