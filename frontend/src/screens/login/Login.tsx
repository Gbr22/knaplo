import React from 'react';

import  InstItem from '../../data/types';
import App from "../../App";
import './login.css';

import { getInst, login } from '../../data/DataHandler';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";

type loginState = {
    inst: InstItem[],
    search: string,
    form:any
}
class LoginScreen extends React.Component<{}, loginState> {
    constructor(props: Object){
        super(props);
        getInst((d: InstItem[])=>{
            this.setState(function(){
                return {inst:d};
            });
        });
        this.state = {
            inst: [],
            search: "",
            form:{
                username:"",
                password:"",
                inst: null
            }
        }
        this.ChangeHandler = this.ChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 150
        });
    }
    cache: CellMeasurerCache;
    ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let nam = event.target.name;
        let val = event.target.value;

        event.target.checked = true;

        this.state.form[nam] = val;
        this.setState({form: this.state.form});
    }
    handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        
        login(this.state.form);
    }
    render(){
        
        let search = (event: React.ChangeEvent<HTMLInputElement>)=>{
            
            this.setState(
                {search: event.target.value}
            );
            this.cache.clearAll();
        }

        
        let filtered = this.state.inst.filter((i)=>{
            let searchProps = ["code","name","city"];
            for (const [key, value] of Object.entries(i)){
                if (searchProps.includes(key)){
                    if (value.toLowerCase().indexOf(this.state.search.toLowerCase()) != -1){    
                        
                        return true;   
                    }
                }
            }
            
            return false;
            
        })

        let noResult = (
            <div className="noResult">
                A keresett intézményre nincs találat
            </div>
        );

        

        let renderRow = (params: { index:number, key:any, style:any, parent:any }) => {
            let e = filtered[params.index];
            return (
                <CellMeasurer
                    key={params.key}
                    cache={this.cache}
                    parent={params.parent}
                    columnIndex={0}
                    rowIndex={params.index}
                >

                    <div className="school" style={params.style} key={params.key}>
                        <input
                            type="radio" name="inst" value={e.code} id={e.code} 
                            checked={this.state.form.inst === e.code}
                            onChange={this.ChangeHandler}
                        />
                        <span className="checkmark">
                            
                        </span>
                        <label htmlFor={e.code}> {e.name} <i>({e.city})</i></label>
                    </div>
                </CellMeasurer>
            )
        }

        return (
            <div className="screen login">
              <div id="login_inner">
                <h1>Bejelentkezés a Krétába</h1>
                <form onSubmit={this.handleSubmit}>
                    <div id="school_section">
                        <input onChange={search} aria-label="Intézmény neve" type="text" placeholder="Intézmény keresése" />
                        
                        <span className="autoSizerParent">
                            {(filtered.length == 0 ? noResult : "")}
                            <AutoSizer className="autoSizer">
                                {
                                    (p: { width: number, height: number }) =>{
                                        return (
                                            <List 
                                                id="schools"
                                                width={p.width}
                                                height={150}
                                                deferredMeasurementCache={this.cache}
                                                rowHeight={this.cache.rowHeight}
                                                rowRenderer={renderRow}
                                                rowCount={filtered.length}
                                                overscanRowCount={3}
                                            />  
                                        );
                                    }
                                }
                            </AutoSizer>
                        </span>
                        
                        
                    </div>
                    <input 
                        aria-label="Felhasználónév"
                        name="username" type="text"
                        placeholder="Felhasználónév"
                        autoComplete="username" required
                        onChange={this.ChangeHandler}
                    />
                    <input
                        aria-label="Jelszó" name="password"
                        type="password" placeholder="Jelszó"
                        autoComplete="current-password" required
                        onChange={this.ChangeHandler}
                    />
                    <input type="submit" value="Bejelentkezés"></input>
                </form>
              </div>
            </div>
        );
    }
  }

export default LoginScreen;