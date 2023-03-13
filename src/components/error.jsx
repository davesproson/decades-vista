import React from "react"

const VistaError = (props) => {
    const featuresColor = "#0abbef"

    return (
        <div style={{
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <svg style={{
                width: "300px",
                height: "300px",
            }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#0abbef" strokeWidth="8" fill={"#252243"}/>
            <circle cx="35" cy="40" r="5" fill={featuresColor}/>
            <circle cx="65" cy="40" r="5" fill={featuresColor}/>
            <path d="M 30 70 Q 50 55 70 70" stroke={featuresColor} strokeWidth="6" fill="none"/>
        </svg>
        <div className="block">
            <div className="is-size-2">Something went wrong!</div>
        </div>
        <div className="block">
            <div className="is-size-8">{props.error}</div>
        </div>
        </div>
    )
}

class VistaErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
        };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true, error: error };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error(error)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <VistaError error={this.state.error} />
      }
  
      return this.props.children; 
    }
  }


export { VistaErrorBoundary }