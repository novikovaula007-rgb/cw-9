import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";

const NavBar = () => {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position='static' sx={{backgroundColor: '#171717'}}>
                <Toolbar>
                    <Typography variant='h6'
                                sx={{flexGrow: 1, textDecoration: 'none', color: 'white'}}
                                component={NavLink}
                                to='/'>
                        Finance tracker
                    </Typography>

                    <Button color='inherit' to='/transactions' component={NavLink}>Transactions</Button>
                    <Button color='inherit' to='/categories' component={NavLink}>Categories</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;