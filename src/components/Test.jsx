<Stack spacing={2} sx={{ mb: 2 }}>
  {/* --- القسم العلوي: زر التحديث --- */}
  <Stack direction="row" justifyContent="flex-start" alignItems="center"
    sx={{gap: 2, backgroundColor: "#f8f9fa", p: 1.5, borderRadius: 3, boxShadow: "0 2px 6px rgba(0,0,0,0.08)",}}>
    <Tooltip title="تحديث البيانات">
      <Button onClick={fetchData}
        sx={{ bgcolor: "#2e7d32",color: "#fff",borderRadius: "50%",
          p: 1.3,minWidth: "48px","&:hover": {bgcolor: "#1b5e20",transform: "scale(1.05)",transition: "all 0.2s ease",},}}
      >
        <UpdateIcon fontSize="medium" />
      </Button>
    </Tooltip>
  </Stack>

  {/* --- القسم السفلي: الفلاتر --- */}
  <Stack
    direction="row"
    flexWrap="wrap"
    alignItems="center"
    justifyContent="space-between"
    sx={{
      gap: 2,
      p: 2,
      backgroundColor: "#ffffff",
      borderRadius: 3,
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    }}
  >
    {/* أزرار التصفية */}
    <ButtonGroup
      variant="outlined"
      aria-label="filter buttons"
      sx={{
        "& .MuiButton-root": {
          fontWeight: "bold",
          px: 3,
          textTransform: "capitalize",
        },
      }}
    >
      <Button
        variant={selected === "in" ? "contained" : "outlined"}
        color="success"
        onClick={() => setSelected("in")}
      >
        In
      </Button>
      <Button
        variant={selected === "out" ? "contained" : "outlined"}
        color="error"
        onClick={() => setSelected("out")}
      >
        Out
      </Button>
      <Button
        variant={selected === "" ? "contained" : "outlined"}
        color="primary"
        onClick={() => setSelected("")}
      >
        All
      </Button>
    </ButtonGroup>

    {/* نطاق التاريخ */}
    <Stack direction="row" spacing={2}>
      <TextField
        type="date"
        label="Start Date"
        value={filtredDate.start}
        onChange={(e) =>
          setFiltredDate({ ...filtredDate, start: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      <TextField
        type="date"
        label="End Date"
        value={filtredDate.end}
        onChange={(e) =>
          setFiltredDate({ ...filtredDate, end: e.target.value })
        }
        InputLabelProps={{ shrink: true }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Stack>

    {/* أزرار إضافية */}
    <Button
      variant="outlined"
      color="warning"
      onClick={() => setFiltredDate({ ...filtredDate, start: "", end: "" })}
      sx={{
        fontWeight: "bold",
        textTransform: "capitalize",
      }}
    >
      Reset
    </Button>

    {/* مربع البحث */}
    <TextField
      label="Search"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{
        width: 220,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  </Stack>
</Stack>;
